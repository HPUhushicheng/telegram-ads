const fs = require('fs');
const axios = require('axios');

// 读取所有返回数据
const allResponses = fs.readFileSync('all_responses.txt', 'utf-8').split('\n').filter(line => line.trim() !== '');

// 提取正常网址的ID并去重
const channelIds = Array.from(new Set(allResponses.map(response => {
  try {
    const data = JSON.parse(response);
    if (data.ok && data.channel && data.channel.id) {
      return data.channel.id;
    }
  } catch (error) {
    console.error('Error parsing response:', error);
  }
  return null;
}).filter(id => id !== null)));

// 将ID组合成字符串
const channelsParam = channelIds.join(';');

// 提交请求
async function submitAd() {
  const data = new URLSearchParams();
  data.append('owner_id', 'QKHiT7xLnR555gHQJMwOH1ATr-U2p7fYKxs4tv335-J_HO4LKko2wQalTfjtG92L');
  data.append('title', 'second');
  data.append('text', 'second');
  data.append('promote_url', 't.me/xz23455');
  data.append('website_name', '');
  data.append('website_photo', '');
  data.append('media', '');
  data.append('ad_info', '');
  data.append('cpm', '0.2');
  data.append('views_per_user', '1');
  data.append('budget', '1');
  data.append('daily_budget', '0');
  data.append('active', '1');
  data.append('target_type', '');
  data.append('langs', '');
  data.append('topics', '');
  data.append('channels', channelsParam);
  data.append('exclude_topics', '');
  data.append('exclude_channels', '');
  data.append('method', 'createAd');

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

    console.log('Ad submitted successfully:', response.data);
  } catch (error) {
    console.error('Error submitting ad:', error);
  }
}

// 执行提交
submitAd();