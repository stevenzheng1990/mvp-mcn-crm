// 简单测试配置文件
const { CONTENT_DATA } = require('./LandingPage.config.ts');

console.log('测试中文版内容标签:');
console.log(CONTENT_DATA.zh.contentTags.title);
console.log(CONTENT_DATA.zh.contentTags.subtitle);

console.log('\n测试英文版内容标签:');
console.log(CONTENT_DATA.en.contentTags.title);
console.log(CONTENT_DATA.en.contentTags.subtitle);

console.log('\n测试中文版图表标题:');
console.log(CONTENT_DATA.zh.charts.creatorIncome.title);

console.log('\n测试英文版图表标题:');
console.log(CONTENT_DATA.en.charts.creatorIncome.title);

console.log('\n测试平台内容:');
console.log('中文:', CONTENT_DATA.zh.platforms.title);
console.log('英文:', CONTENT_DATA.en.platforms.title);