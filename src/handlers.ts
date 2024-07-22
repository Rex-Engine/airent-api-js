import createHttpError from "http-errors";
import * as z from "zod";
import {
  CreateOneApiHandlerConfig,
  GetManyApiHandlerConfig,
  GetOneApiHandlerConfig,
  HandlerConfig,
  HandlerContext,
  UpdateOneApiHandlerConfig,
} from "./types";
import { isReadableStream } from "./utils";

function handleGetMany<
  CONTEXT,
  RESULT,
  OPTIONS,
  QUERY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
>(
  config: GetManyApiHandlerConfig<
    CONTEXT,
    RESULT,
    OPTIONS,
    QUERY_ZOD,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const { query: queryRaw, fieldRequest } = await getRequestJson(request);
    if (queryRaw === undefined) {
      throw createHttpError.BadRequest("Missing `query`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const query = (await config.queryZod.parseAsync(
      queryRaw
    )) as z.infer<QUERY_ZOD>;
    return { query, fieldRequest };
  };
  const executor = (
    parsed: { query: z.infer<QUERY_ZOD>; fieldRequest: FIELD_REQUEST },
    context: CONTEXT
  ) => config.action(parsed.query, context, parsed.fieldRequest);
  return handle({ ...config, parser, executor });
}

function handleGetOne<
  CONTEXT,
  RESULT,
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
>(
  config: GetOneApiHandlerConfig<
    CONTEXT,
    RESULT,
    OPTIONS,
    PARAMS_ZOD,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const { params: paramsRaw, fieldRequest } = await getRequestJson(request);
    if (paramsRaw === undefined) {
      throw createHttpError.BadRequest("Missing `params`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const params = (await config.paramsZod.parseAsync(
      paramsRaw
    )) as z.infer<PARAMS_ZOD>;
    return { params, fieldRequest };
  };
  const executor = (
    parsed: { params: z.infer<PARAMS_ZOD>; fieldRequest: FIELD_REQUEST },
    context: CONTEXT
  ) => config.action(parsed.params, context, parsed.fieldRequest);
  return handle({ ...config, parser, executor });
}

function handleCreateOne<
  CONTEXT,
  RESULT,
  OPTIONS,
  BODY_ZOD extends z.ZodTypeAny,
  FIELD_REQUEST
>(
  config: CreateOneApiHandlerConfig<
    CONTEXT,
    RESULT,
    OPTIONS,
    BODY_ZOD,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const { body: bodyRaw, fieldRequest } = await getRequestJson(request);
    if (bodyRaw === undefined) {
      throw createHttpError.BadRequest("Missing `body`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const body = (await config.bodyZod.parseAsync(
      bodyRaw
    )) as z.infer<BODY_ZOD>;
    return { body, fieldRequest };
  };
  const executor = (
    parsed: { body: z.infer<BODY_ZOD>; fieldRequest: FIELD_REQUEST },
    context: CONTEXT
  ) => config.action(parsed.body, context, parsed.fieldRequest);
  return handle({ ...config, parser, executor, code: 201 });
}

function handleUpdateOne<
  CONTEXT,
  RESULT,
  OPTIONS,
  PARAMS_ZOD extends z.ZodTypeAny,
  BODY,
  FIELD_REQUEST
>(
  config: UpdateOneApiHandlerConfig<
    CONTEXT,
    RESULT,
    OPTIONS,
    PARAMS_ZOD,
    BODY,
    FIELD_REQUEST
  >
): (request: Request) => Promise<Response> {
  const parser = async (request: Request) => {
    const {
      params: paramsRaw,
      body: bodyRaw,
      fieldRequest,
    } = await getRequestJson(request);
    if (paramsRaw === undefined) {
      throw createHttpError.BadRequest("Missing `params`");
    }
    if (bodyRaw === undefined) {
      throw createHttpError.BadRequest("Missing `body`");
    }
    if (fieldRequest === undefined) {
      throw createHttpError.BadRequest("Missing `fieldRequest`");
    }
    const params = (await config.paramsZod.parseAsync(
      paramsRaw
    )) as z.infer<PARAMS_ZOD>;
    const body = (await config.bodyZod.parseAsync(bodyRaw)) as BODY;
    return { params, body, fieldRequest };
  };
  const executor = (
    parsed: {
      params: z.infer<PARAMS_ZOD>;
      body: BODY;
      fieldRequest: FIELD_REQUEST;
    },
    context: CONTEXT
  ) => config.action(parsed.params, parsed.body, context, parsed.fieldRequest);
  return handle({ ...config, parser, executor });
}

const handleSearch = handleGetMany;
const handleGetOneSafe = handleGetOne;
const handleDeleteOne = handleGetOne;

async function getRequestJson(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch (error: any) {
    throw createHttpError.BadRequest(error.message);
  }
}

// Note: request => authenticate => parse => execute => respond
function handle<CONTEXT, PARSED, RESULT, OPTIONS>(
  config: HandlerConfig<CONTEXT, PARSED, RESULT, OPTIONS>
): (request: Request) => Promise<Response> {
  const { authenticator, options, code } = config;

  const parserWrapper = config.parserWrapper ?? ((f) => f);
  const executorWrapper = config.executorWrapper ?? ((f) => f);
  const parser = parserWrapper(config.parser, options);
  const validator = config.validator ?? (() => {});
  const executor = executorWrapper(config.executor, options);
  const errorHandler =
    config.errorHandler ??
    ((error) => {
      throw error;
    });

  return async (request: Request) => {
    const data: HandlerContext<CONTEXT, PARSED, RESULT> = { request };
    try {
      kill();
      data.context = await authenticator(request);
      data.parsed = await parser(request, data.context);
      await validator(data.parsed, data.context, options);
      data.result = await executor(data.parsed, data.context);
      return respond(data.result, code);
    } catch (error) {
      return await errorHandler(error, data);
    }
  };
}

function kill(): void {
  if (process.env.KILL_SWITCH) {
    throw createHttpError.ServiceUnavailable();
  }
}

function respond<RESULT>(result: RESULT, status: number = 200): Response {
  if (isReadableStream(result)) {
    const headers = { "Content-Type": "text/plain" };
    return new Response(result as ReadableStream, { headers });
  }
  return Response.json(result, { status });
}

export {
  handle,
  handleCreateOne,
  handleDeleteOne,
  handleGetMany,
  handleGetOne,
  handleGetOneSafe,
  handleSearch,
  handleUpdateOne,
};
