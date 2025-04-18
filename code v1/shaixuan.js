const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const banner = fs.readFileSync('banner.txt', 'utf-8');
console.log(banner);


// 读取txt文件中的网址
const urls = fs.readFileSync('site.txt', 'utf-8').split('\n').map(url => url.trim());

// 定义文件路径
const validUrlsFile = 'valid_urls.txt';
const invalidUrlsFile = 'invalid_urls.txt';
const allResponsesFile = 'all_responses.txt';

// 清空文件内容
fs.writeFileSync(validUrlsFile, '');
fs.writeFileSync(invalidUrlsFile, '');
fs.writeFileSync(allResponsesFile, '');

// 定义一个函数来处理每个网址
async function checkUrl(url) {
  const data = new URLSearchParams();
  data.append('query', url);
  data.append('field', 'channels');
  data.append('method', 'searchChannel');

  try {
    const response = await axios({
      method: 'post',
      url: 'https://ads.telegram.org/api?hash=4cfc54aea90efe0e5c',
      headers: {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'zh-CN,zh;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': 'stel_ssid=fc4536ee2ce158e53c_13167942688048228180; stel_dt=-480; stel_token=b37df83929a41f66d470b22e60352e2cb37df82fb37dfc5082da369b2750e31d392cd; stel_adowner=QKHiT7xLnR555gHQJMwOH1ATr-U2p7fYKxs4tv335-J_HO4LKko2wQalTfjtG92L',
        'origin': 'https://ads.telegram.org',
        'priority': 'u=1, i',
        'referer': 'https://ads.telegram.org/account/ad/new',
        'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
      },
      data: data.toString()
    });

    // 保存返回数据到总文件
    fs.appendFileSync(allResponsesFile, JSON.stringify(response.data) + '\n');

    if (response.data.ok) {
      console.log(`Valid URL: ${url}`);
      fs.appendFileSync(validUrlsFile, url + '\n');
    } else {
      console.log(`Error for URL: ${url} - ${response.data.error}`);
      fs.appendFileSync(invalidUrlsFile, url + '\n');
    }
  } catch (error) {
    console.error(`Request failed for URL: ${url} - ${error.message}`);
    fs.appendFileSync(invalidUrlsFile, url + '\n');
  }
}

// 定义一个异步函数来逐个处理网址
async function processUrls() {
  console.log('开始处理...');
  for (const url of urls) {
    await checkUrl(url);
    // 每次请求后等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('处理完成！');
  console.log(`正常网址保存在: ${validUrlsFile}`);
  console.log(`异常网址保存在: ${invalidUrlsFile}`);
  console.log(`所有返回数据保存在: ${allResponsesFile}`);
  rl.close();
}

// 启动 CLI
rl.question('按 Enter 开始处理网址...', (answer) => {
  processUrls();
});