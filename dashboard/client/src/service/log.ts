import { get } from "./requestHandlers";

export const getLogDetail = async (url: string) => {
  if (window.location.pathname !== "/" && url !== "log_index") {
    const pathArr = window.location.pathname.split("/");
    if (pathArr.length > 1) {
      const idx = pathArr.findIndex((e) => e.includes(":"));
      if (idx > -1) {
        const afterArr = pathArr.slice(0, idx);
        afterArr.push(url.replace(/https?:\/\//, ""));
        url = afterArr.join("/");
      }
    }
  }
  const rsp = await get(
    url === "log_index" ? url : `log_proxy?url=${encodeURIComponent(url)}`,
  );
  if (rsp.headers["content-type"]?.includes("html")) {
    const el = document.createElement("div");
    el.innerHTML = rsp.data;
    let arr: { [key: string]: string }[] = Array.from(el.getElementsByTagName("li")).map(
      (li: HTMLLIElement) => {
        const a = li.children[0] as HTMLAnchorElement;
        const result: { [key: string]: string } = {
          name: li.innerText,
          href: li.innerText.includes("http") ? a.href : a.pathname,
        }
        return result;
      },
    );
    return arr;
  }

  return rsp.data as string;
};
