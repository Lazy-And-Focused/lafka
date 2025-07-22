import { Api } from "./api";

type Return<
  Root extends keyof Api.Routes,
  Url extends Api.Path<Root>
> = {
  url: string,
  type: ResponseType,
  statusText: string,
  body: ReadableStream<Uint8Array<ArrayBufferLike>>,
  bodyUsed: boolean,
  status: number,
  headers: Headers,
  ok: boolean,
  redirected: boolean,

  blob: () => Promise<Blob>,
  arrayBuffer: () => Promise<ArrayBuffer>,
  bytes: () => Promise<Uint8Array>,
  clone: () => Response,
  formData: () => Promise<FormData>,

  //@ts-ignore
  data: Api.ParseRoute<Root, Url>["return"]
};

export class frapi<ApiUrl extends string> {
  public constructor(public readonly url: ApiUrl) {};

  public readonly parseInit = <
    Root extends keyof Api.Routes,
    Url extends Api.Path<Root>
  >(
    init: Api.RequestInitialize<Root, Url>
  ): RequestInit => {
    const body = JSON.stringify(init.body);
    const headers = {
      "Content-Type": "application/json;charset=utf-8",
      ...init.headers,
    };

    return {
      ...init,
      headers, body,
    };
  }

  public readonly parseURL = <
    Root extends keyof Api.Routes,
    Url extends Api.Path<Root>
  >({
    root, url
  }: {
    root: Root,
    url: Url
  }) => {
    const stringUrl = String(url);
    const method = stringUrl.match(Api.METHOD_REGEXP);
    
    if (!method || !method[0]) throw new Error("url is does not have method");

    const path = stringUrl.slice(method[0].length+1);
    
    return { method: method[0], url: root + path } as {
      method: string,
      url: `${ApiUrl}/${Root}${Api.ParseRoute<Root, Url>["path"]}`
    };
  };

  public readonly fetch = async <
    Root extends keyof Api.Routes,
    Url extends Api.Path<Root>
  >(data: {
    root: Root,
    url: Url,
    init: Api.RequestInitialize<Root, Url, undefined>
  }): Promise<Return<Root, Url>> => {
    const url = this.parseURL(data).url;
    const query = this.parseQuery(data.init.query);

    const fetched = await fetch(url + query, this.parseInit(data.init));
    
    try {
      const json = await fetched.json();
      
      return this.writeFetched(fetched, json);
    } catch (error) {
      return this.writeFetched(fetched, null);
    };
  };

  private readonly parseQuery = (query?: unknown): string => {
    if (typeof query !== "object") return "";
    if (!query) return "";

    return Object.keys(query).length === 0
      ? ""
      : "?" + Object.keys(query).map(k => [k, query[k]]).map(e => e.join("=")).join("&");
  }

  private readonly writeFetched = <
    Root extends keyof Api.Routes,
    Url extends Api.Path<Root>
  //@ts-ignore
  >(fetched: Response, data: Api.ParseRoute<Root, Url>["return"]): Return<Root, Url> => {
    return {
      url: fetched.url,
      type: fetched.type,
      statusText: fetched.statusText,
      body: fetched.body,
      bodyUsed: fetched.bodyUsed,
      status: fetched.status,
      headers: fetched.headers,
      ok: fetched.ok,
      redirected: fetched.redirected,

      blob: fetched.blob,
      arrayBuffer: fetched.arrayBuffer,
      bytes: fetched.bytes,
      clone: fetched.clone,
      formData: fetched.formData,

      data
    }
  }
};

export { Api };

export default frapi;
