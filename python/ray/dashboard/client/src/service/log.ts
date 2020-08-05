import axios from "axios";

type LogRsp = {
  "result": boolean,
  "msg": string,
  "data": {
    "logUrls": string[]
  }
}

export function getLogs() {
  return axios.get<LogRsp>('logs');
}

export async function getLogDetail(url: string) {
  if (window.location.pathname !== '/') {
    const pathArr = window.location.pathname.split('/');
    if (pathArr.length > 1) {
      const idx = pathArr.findIndex(e => e.includes(':'));
      if (idx > -1) {
        const afterArr = pathArr.slice(0, idx);
        afterArr.push(url.replace(/https?:\/\//, ''))
        url = afterArr.join('/')
      }
    }
  }
  const rsp = await axios.get(url);
  if (rsp.headers['content-type']?.includes('html')) {
    const el = document.createElement('div');
    el.innerHTML = rsp.data;
    const arr = [].map.call(el.getElementsByTagName('li'), (li: HTMLLIElement) => {
      const a = li.children[0] as HTMLAnchorElement;
      return {
        name: li.innerText,
        href: li.innerText.includes('http') ? a.href : a.pathname,
      } as { [key: string]: string }
    });
    return arr as { [key: string]: string }[];
  }

  return rsp.data as string;
}
