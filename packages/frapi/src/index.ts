import { Api } from "./api";

export class frapi<ApiURL extends string> {
  public constructor(public readonly url: ApiURL) {};

  public readonly parseInit = <
    Root extends keyof Api.Routes,
    URL extends Api.Path<Root>
  >(
    init: Api.RequestInitialize<Root, URL>
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
    URL extends Api.Path<Root>
  >({
    root, url
  }: {
    root: Root,
    url: URL
  }) => {
    const stringUrl = String(url);
    const method = stringUrl.match(Api.METHOD_REGEXP);
    
    if (!method || !method[0]) throw new Error("url is does not have method");

    const path = stringUrl.slice(method[0].length+1);
    
    return { method: method[0], url: root + path } as {
      method: string,
      url: `${ApiURL}/${Root}${Api.ParseRoute<Root, URL>["path"]}`
    };
  };

  public readonly fetch = async <
    Root extends keyof Api.Routes,
    URL extends Api.Path<Root>
  >(data: {
    root: Root,
    url: URL,
    init: Api.RequestInitialize<Root, URL, undefined>
  }): Promise<{
    url: string,
    type: ResponseType,
    statusText: string,
    body: ReadableStream<Uint8Array<ArrayBufferLike>>,
    bodyUsed: boolean,
    status: string,
    headers: Headers,
    ok: boolean,
    redirected: boolean,

    blob: () => Promise<Blob>,
    arrayBuffer: () => Promise<ArrayBuffer>,
    bytes: () => Promise<Uint8Array>,
    clone: () => Response,
    formData: () => Promise<FormData>,

    //@ts-ignore
    data: Api.ParseRoute<Root, URL>["return"] & { type: Root }
  }> => {
    const url = this.parseURL(data).url;
    const query = data.init.query || "";

    const fetched = await fetch(url + query, this.parseInit(data.init));
    
    try {
      const json = await fetched.json();
      
      return this.writeFetched["return"](fetched, json);
    } catch (error) {
      return this.writeFetched["return"](fetched, {
        error: error,
        successed: false,
        resource: null,
        created_resource: null,
        changed_resource: null,
        deleted_resource: null
      })
    };
  };

  private readonly writeFetched = <T>(fetched: Response, data: T) => {
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
