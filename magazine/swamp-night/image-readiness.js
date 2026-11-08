/* Local application image readiness: no network requests or fallbacks are introduced. */
(() => {
  const images = [...document.querySelectorAll('img')];
  const updateOverallState = () => {
    const states = images.map(image => image.dataset.decodeState);
    document.documentElement.dataset.mediaState = states.some(state => state === 'failed' || state === 'empty')
      ? 'failed'
      : states.every(state => state === 'decoded') ? 'ready' : 'loading';
  };
  document.documentElement.dataset.mediaState = 'loading';
  for (const image of images) {
    const inspect = async () => {
      try {
        await image.decode();
        image.dataset.decodeState = image.naturalWidth > 0 ? 'decoded' : 'empty';
      } catch {
        image.dataset.decodeState = 'failed';
      }
      updateOverallState();
    };
    if (image.complete) inspect();
    else {
      image.addEventListener('load', inspect, {once:true});
      image.addEventListener('error', () => {
        image.dataset.decodeState = 'failed';
        updateOverallState();
      }, {once:true});
    }
  }
})();
