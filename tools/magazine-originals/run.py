#!/usr/bin/env python3
"""Run ORIGINAL magazine tools in an isolated workspace; never deploy or send.
Original repos are complete clones, not generated adapter substitutes.
"""
from __future__ import annotations
import argparse, datetime as dt, hashlib, json, os, re, shutil, subprocess, sys, time
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = json.loads((HERE/'manifest.json').read_text())

def stamp(): return dt.datetime.now(dt.timezone.utc).isoformat()
def digest(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('mode',choices=['ingest','run'])
    ap.add_argument('--workspace',type=Path,default=HERE/'.lab')
    args=ap.parse_args()
    lab=args.workspace.resolve(); lab.mkdir(parents=True,exist_ok=True)
    for p in ['sources','work','runtime','output','reports','logs']: (lab/p).mkdir(exist_ok=True)
    # A completed workspace is preserved. Do not reset a source or overwrite experiments.
    receipt=lab/'reports'/'intake.json'
    if receipt.exists(): raise SystemExit('Workspace already has a receipt. Inspect it or choose a new --workspace; nothing overwritten.')
    env=os.environ.copy(); env.update({'DISABLE_TELEMETRY':'1','DO_NOT_TRACK':'1','CI':'1'})
    report={'started':stamp(),'mode':args.mode,'host':sys.platform,'workspace':str(lab),'tools':[],'productionChanged':False,'nativeModelExecuted':False}
    commands=[]
    def run(cmd,cwd=None,timeout=600,allow_failure=False):
        key=f'{len(commands)+1:03d}'
        row={'command':list(map(str,cmd)),'cwd':str(cwd or lab),'start':stamp(),'log':key+'.log'}
        commands.append(row)
        print('RUN',key, ' '.join(map(str,cmd)), flush=True)
        with (lab/'logs'/row['log']).open('w') as log:
            try:
                r=subprocess.run(row['command'],cwd=cwd or lab,env=env,stdout=log,stderr=subprocess.STDOUT,timeout=timeout)
                row['exitCode']=r.returncode
            except subprocess.TimeoutExpired:
                row['exitCode']=124
        row['finished']=stamp()
        report['commands']=commands; receipt.write_text(json.dumps(report,indent=2))
        output=(lab/'logs'/row['log']).read_text(errors='replace')
        if row['exitCode'] and not allow_failure: raise RuntimeError(f'Command {key} failed ({row["exitCode"]}): '+output[-1400:])
        return row['exitCode'],output
    def save():
        report['updated']=stamp(); report['commands']=commands
        receipt.write_text(json.dumps(report,indent=2))
    git=shutil.which('git')
    if not git: raise SystemExit('Git is required; no automatic system-level installer is run.')
    chrome=next((p for p in [os.environ.get('CHROME_PATH',''),shutil.which('google-chrome'),shutil.which('chromium'),'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] if p and Path(p).is_file()),None)
    if chrome:
        env['PUPPETEER_SKIP_DOWNLOAD']='1';env['PUPPETEER_EXECUTABLE_PATH']=chrome
    for tool in MANIFEST['tools']:
        row=dict(tool);report['tools'].append(row); row['stage']='INGESTING';save()
        src=lab/'sources'/tool['name']
        try:
            # Full original checkout including documentation and upstream submodules.
            if src.exists(): raise RuntimeError('Existing source destination: refusing to reset or overwrite '+str(src))
            run([git,'clone','https://github.com/'+tool['repo']+'.git',src],timeout=300)
            run([git,'checkout','--detach',tool['sha']],src)
            run([git,'-c','url.https://github.com/.insteadOf=git@github.com:','submodule','update','--init','--recursive'],src,timeout=300)
            _,head=run([git,'rev-parse','HEAD'],src)
            if head.strip()!=tool['sha']: raise RuntimeError('Source revision mismatch')
            _,status=run([git,'status','--porcelain','--untracked-files=no'],src)
            if status.strip(): raise RuntimeError('Source not clean')
            _,files=run([git,'ls-files'],src)
            row['trackedFiles']=len(files.splitlines());row['sourceHead']=head.strip()
            license_path=src/tool['licenseFile']
            # Different upstreams use LICENSE.md; discover the actual license filename.
            if not license_path.is_file():
                matches=[p for p in [src/'LICENSE',src/'LICENSE.md',src/'LICENSE.txt'] if p.is_file()]
                if not matches: raise RuntimeError('License file missing; stop this tool')
                license_path=matches[0]
            row['licenseFile']=license_path.name;row['licenseSha256']=digest(license_path)
            row['stage']='INGESTED_ORIGINAL'
            if args.mode=='ingest': save();continue
            work=lab/'work'/tool['name']
            shutil.copytree(src,work,symlinks=True,ignore=shutil.ignore_patterns('.git','node_modules','target'))
            row['stage']='INSTALLING';save()
            name=tool['name']
            if name in ('colorlib','pagedjs','pagedjs-cli'):
                run(['npm','ci' if (work/'package-lock.json').exists() else 'install','--no-fund'],work,timeout=600)
                run(['npm','run','build']+(['--','--bundleConfigAsCjs'] if name=='pagedjs' else []),work,timeout=300)
                code,audit=run(['npm','audit','--json'],work,allow_failure=True,timeout=90)
                row['auditExitCode']=code
                try: row['advisories']=json.loads(audit).get('metadata',{}).get('vulnerabilities',{})
                except json.JSONDecodeError: row['auditStatus']='UNKNOWN: see raw log'
                row['productionEligibility']='HOLD_REVIEW' if row.get('advisories',{}).get('total',0) or code else 'NOT_CERTIFIED_BY_AUDIT'
                if (work/'package-lock.json').is_file(): row['lockfileSha256']=digest(work/'package-lock.json')
                if name=='colorlib':
                    templates=sorted(p for p in work.glob('[0-9]*/index.html') if p.stat().st_size>100)
                    expected=list((work/'src').glob('[0-9]*.mjml'))
                    if len(templates)!=len(expected) or not templates: raise RuntimeError('Missing compiled original templates')
                    row['templatesBuilt']=len(templates)
                elif name=='pagedjs':
                    p=work/'dist'/'paged.polyfill.js'
                    if not p.is_file():raise RuntimeError('Native polyfill missing')
                    row['polyfillSha256']=digest(p)
                else:
                    if not chrome: raise RuntimeError('Chrome missing; install completed, PDF runtime test blocked')
                    shutil.copy2(HERE/'fixtures'/'publication.html',lab/'output'/'publication.html')
                    run(['node',work/'src'/'cli.js',lab/'output'/'publication.html','-o',lab/'output'/'paged-cli.pdf'],work,timeout=180)
                    if not (lab/'output'/'paged-cli.pdf').is_file():raise RuntimeError('Native CLI produced no PDF')
            elif name=='zine':
                if not shutil.which('cargo'):raise RuntimeError('Cargo/Rust missing; original source ingested, native install blocked')
                # Native Cargo source installation: unmodified complete upstream checkout.
                run(['cargo','install','--path',work,'--root',lab/'runtime'/'zine'],timeout=900)
                binary=lab/'runtime'/'zine'/'bin'/'zine'
                _,version=run([binary,'--version']);row['installedVersion']=version.strip()
                run([binary,'new','zine-demo'],lab/'work')
                run([binary,'build'],lab/'work'/'zine-demo')
                builds=list((lab/'work'/'zine-demo'/'build').rglob('*.html'))
                if not builds:raise RuntimeError('Native Zine produced no HTML')
                row['htmlPages']=len(builds)
                row['maintenanceNote']='Pinned upstream commit dates to July 2023; not a production security certificate.'
            elif name=='baoyu-design':
                host=lab/'work'/'design-host';host.mkdir(exist_ok=True)
                version='1.7.0'
                if not re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?',version):raise RuntimeError('Unrecognized skills package version')
                cli=['npx','--yes','skills@'+version]
                run(cli+['add',src,'--skill','baoyu-design','--agent','claude-code','--yes'],host)
                _,listing=run(cli+['list','--agent','claude-code'],host)
                leaf=host/'.claude'/'skills'/'baoyu-design'
                if not (leaf/'SKILL.md').is_file() or 'baoyu-design' not in listing:raise RuntimeError('Native skill discovery failed')
                expected=src/'skills'/'baoyu-design';checked=0
                for p in expected.rglob('*'):
                    if p.is_file():
                        q=leaf/p.relative_to(expected)
                        if not q.is_file() or digest(q)!=digest(p):raise RuntimeError('Full original skill mismatch: '+str(p.relative_to(expected)))
                        checked+=1
                row.update({'installerVersion':version,'originalSkillFilesVerified':checked,'installedPath':str(leaf),'stage':'INSTALLED_DISCOVERABLE_MODEL_RUN_PENDING'})
            elif name=='vivliostyle':
                prefix=lab/'runtime'/'vivliostyle'
                run(['npm','install','--global','--prefix',prefix,'@vivliostyle/cli@'+tool['version'],'--no-fund'],timeout=600)
                binary=prefix/'bin'/'vivliostyle'
                _,version=run([binary,'--version']);row['installedVersion']=version.strip()
                if not chrome:raise RuntimeError('Chrome missing; native export test blocked')
                shutil.copy2(HERE/'fixtures'/'publication.html',lab/'output'/'publication.html')
                run([binary,'build',lab/'output'/'publication.html','--single-doc','--executable-browser',chrome,'--timeout','120','-o',lab/'output'/'vivliostyle.pdf'],timeout=180)
                if not (lab/'output'/'vivliostyle.pdf').is_file():raise RuntimeError('Native Vivliostyle produced no PDF')
            if row['stage']=='INSTALLING':row['stage']='NATIVE_BUILD_PASSED'
            # Original clone remains pristine; work copies contain generated files/dependencies.
            _,clean=run([git,'status','--porcelain','--untracked-files=no'],src)
            row['originalSourceUnchanged']=not clean.strip()
        except Exception as e:
            row['failedAt']=row['stage'];row['stage']='BLOCKED_OR_FAILED';row['error']=str(e)
        save()
    if args.mode=='run':
        try:
            if not chrome:raise RuntimeError('No sandbox-capable Chrome available')
            run(['node',HERE/'browser-test.mjs',lab/'work',lab/'output',chrome],timeout=180)
            report['browserQC']=json.loads((lab/'output'/'browser-report.json').read_text())
        except Exception as e:
            partial=lab/'output'/'browser-report.json'
            report['browserQC']=json.loads(partial.read_text()) if partial.exists() else {}
            report['browserQC'].update({'status':'BLOCKED_OR_FAILED','error':str(e)})
        try:
            from pypdf import PdfReader
            pdfs=[]
            for p in sorted((lab/'output').glob('*.pdf')):
                r=PdfReader(p);text='\n'.join(pg.extract_text() for pg in r.pages)
                good=len(r.pages)==2 and 'END OF NATIVE TOOL TEST' in text
                pdfs.append({'name':p.name,'bytes':p.stat().st_size,'pages':len(r.pages),'endMarker': 'END OF NATIVE TOOL TEST' in text,'sha256':digest(p),'pass':good})
            report['independentPDFQC']=pdfs
            if len(pdfs)!=3 or not all(p['pass'] for p in pdfs):report['independentPDFStatus']='INCOMPLETE_OR_FAILED'
            else:report['independentPDFStatus']='PASS'
        except Exception as e:report['independentPDFStatus']='BLOCKED: '+str(e)
    report['finished']=stamp();save()
    print('RESULT_JSON_BEGIN\n'+json.dumps(report,indent=2)+'\nRESULT_JSON_END',flush=True)
    return int(any(t['stage']=='BLOCKED_OR_FAILED' for t in report['tools']) or (args.mode=='run' and report.get('independentPDFStatus')!='PASS'))

if __name__=='__main__':sys.exit(main())
