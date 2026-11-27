  /* Optional pregame video desk. Only bundled when the issue supplies videos.
   * Native Wix originals retain their credits; YouTube loads only after a deliberate tap. */
  function pgVideoItems(D) {
    var V = obj(D.videos);
    return V ? list(V.items, 8).map(obj).filter(function (v) {
      return v && text(v.title, 160) && (/^[A-Za-z0-9_-]{11}$/.test(String(v.youtubeId || '')) || /^[0-9a-f]+_[0-9a-f]{32}$/i.test(String(v.wixId || '')));
    }) : [];
  }
  function pgVideoNav(D) { return pgVideoItems(D).length ? '<nav class="pg-jump" aria-label="In this issue"><b>In this issue</b><a href="#pg-videos">Videos</a></nav>' : ''; }
  function pgVideos(D) {
    var V = obj(D.videos), items = pgVideoItems(D);
    if (!items.length) return '';
    return '<section class="pg-videos" id="pg-videos" aria-labelledby="pg-videos-t">' + pgHeadSec('pg-videos', text(V.label, 40) || 'The press room', text(V.note, 160)) + '<div class="pg-video-grid">' + items.map(function (v) {
      var title = text(v.title, 160), yt = /^[A-Za-z0-9_-]{11}$/.test(String(v.youtubeId || '')) ? v.youtubeId : '', portrait = !yt && v.aspectRatio === '9:16', player;
      if (yt) {
        player = '<div class="pg-video-player" data-pg-video-host><button type="button" class="pg-video-play" data-pg-youtube="' + esc(yt) + '" aria-label="Play ' + esc(title) + '"><span class="pg-video-triangle" aria-hidden="true">&#9654;</span><b>Play video</b><span>YouTube loads when you play</span></button></div>';
      } else {
        var poster = /^[0-9a-f]+_[0-9a-f]{32}$/i.test(String(v.poster || '')) ? ' poster="https://static.wixstatic.com/media/' + esc(v.poster) + '~mv2.jpg/v1/fit/' + (portrait ? 'w_720,h_1280' : 'w_1280,h_720') + ',q_85/poster.jpg"' : '';
        player = '<div class="pg-video-player' + (portrait ? ' pg-video-player--portrait' : '') + '"><video controls playsinline preload="metadata" aria-label="' + esc(title) + '"' + poster + ' src="https://video.wixstatic.com/video/' + esc(v.wixId) + '/file"></video></div>';
      }
      return '<article class="pg-video"><h3>' + esc(title) + '</h3>' + player + '<p class="pg-video-date">' + esc(text(v.date, 80)) + '</p>' + (text(v.source, 320) ? '<p class="pg-video-credit">' + esc(text(v.source, 320)) + '</p>' : '') + (text(v.note, 240) ? '<p class="pg-video-note">' + esc(text(v.note, 240)) + '</p>' : '') + '</article>';
    }).join('') + '</div></section>';
  }
  function pgVideosStart(root) {
    if (root.__pgVideos) return; root.__pgVideos = true;
    root.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-pg-youtube]') : null;
      if (!b || !root.contains(b)) return;
      var id = b.getAttribute('data-pg-youtube'); if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return;
      var host = b.closest('[data-pg-video-host]'); if (!host) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&autoplay=1';
      iframe.title = (b.getAttribute('aria-label') || 'Play video').replace(/^Play /, '');
      iframe.loading = 'lazy'; iframe.allowFullscreen = true;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      host.replaceChildren(iframe); iframe.focus();
    });
  }
