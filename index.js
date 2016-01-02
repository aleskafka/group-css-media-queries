
var parseCss = require('css-parse');
var stringifyCss = require('css-stringify');

module.exports = function(css) {
  var parsed = parseCss(css);
  var rules = parsed.stylesheet.rules;
  var medias = buildMedias(rules);

  parsed.stylesheet.rules = [].
    concat(rules.filter(function(rule) { return rule.type !== 'media'; })).
    concat(sortMedia(medias, true, false, function(a, b) { return a.minWidth - b.minWidth })).
    concat(sortMedia(medias, false, true, function(a, b) { return b.maxWidth - a.maxWidth })).
    concat(sortMedia(medias, true, true, function(a, b) { return a.minWidth - b.minWidth })).
    concat(sortMedia(medias, false, false, function(a, b) { return 1 }))

  return stringifyCss(parsed);
}

function buildMedias(rules) {
  var medias = {};
  rules.
    filter(function(rule) { return rule.type === 'media'}).
    map(function(rule) { medias[rule.media] = (medias[rule.media] || []).concat(rule.rules) });

  return Object.keys(medias).map(function(media) {
    return {
      type: "media",
      media: media,
      rules: medias[media],
      minWidth: parseWidth(media, 'min-width'),
      maxWidth: parseWidth(media, 'max-width')
    }
  });
}

function parseWidth(media, str) {
  var m = media.match(new RegExp(str + ":\\s*([0-9\.]+)(px|em)"));
  return m ? parseInt(m[1], 10)*(m[2]==='em' ? 16 : 1) : 0;
}

function sortMedia(medias, minWidth, maxWidth, sortFn) {
  return medias.
    filter(function(rule) { return !!rule.minWidth===minWidth }).
    filter(function(rule) { return !!rule.maxWidth===maxWidth }).
    sort(sortFn);
}
