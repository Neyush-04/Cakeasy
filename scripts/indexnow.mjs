// Tells Bing/Yandex/Seznam (IndexNow) that every sitemap URL changed.
// Run after a release:  node scripts/indexnow.mjs
// The key is public by design: it only proves this site owns public/3427882d14bc3b1903b5011106a74b35.txt.
const KEY = '3427882d14bc3b1903b5011106a74b35';
const HOST = 'www.cakeasy.in';

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error('No URLs found in the sitemap');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
if (response.status >= 300) console.log(await response.text());
