type JSONSuccess<T = undefined> = {
  success: true
  msg: string
  data: T
}

type JSONFail = {
  success: false
  detail: string
}

type JSONResponse<T = undefined> = JSONSuccess<T> | JSONFail
