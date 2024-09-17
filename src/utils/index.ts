import { isEmpty, omit, pick } from "lodash"

export const isObj = (obj: any) => obj instanceof Object && !Array.isArray(obj)

export const isNullish = (val: any) => (val ?? null) === null

export const isEmptyObj = (obj: Object) => !Object.keys(obj).length

export const removeNullishElements = (arr: Array<any>) => {
  const final: typeof arr = []

  arr.forEach((ele) => {
    if (!isNullish(ele)) {
      const result = removeNestedNullish(ele)
      if (result instanceof Object && isEmptyObj(result)) return

      final[final.length] = result
    }
  })

  return final.filter((ele) => !isNullish(ele) && ele)
}

export const removeNestedNullish = <T>(any: any): T => {
  if (any instanceof Array) return removeNullishElements(any as Array<any>) as T
  if (any instanceof Object) return removeNullishAttributes(any as Object) as T

  return any
}

export const removeNullishAttributes = (obj: Object) => {
  const final: Record<string, any> = {}

  ;(Object.keys(obj) as Array<keyof typeof obj>).forEach((key) => {
    if (!isNullish(obj[key])) {
      const result = removeNestedNullish(obj[key])

      if (result instanceof Object && isEmptyObj(result)) return

      final[key] = result
    }
  })

  return final
}

export const getSkipNumber = (limit: number, page: number) => limit * (page - 1)

export const getInfoData = <T>({ fields = [], object }: { fields: string[]; object: T }) =>
  pick(object, fields)

/**
 *
 * @param select ["a","b"]
 * @returns Object { a:1, b:1 }
 */
export const getSelectData = (select: string[] = []): Record<string, 1> => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}

/**
 *
 * @param  unSelect ["a","b"]
 * @returns Object { a:0, b:0 }
 */
export const getUnSelectData = (unSelect: string[] = []): Record<string, 0> => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]))
}

// TODO: I will type this function later.
const updateNestedObjectParser = (obj: any): Record<string, any> => {
  const final: Record<string, any> = {}

  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k])
      Object.keys(response).forEach((a) => {
        const x = `${k}.${a}`
        // z: Partially update MongoDB object
        final[x] = response[a]
      })
    } else {
      final[k] = obj[k]
    }
  })

  return final
}

export const flattenObj = (obj: Object, parent?: string, res: { [key: string]: any } = {}) => {
  ;(Object.keys(obj) as Array<keyof typeof obj>).forEach((key) => {
    let propName = parent ? parent + "." + key : key
    if (isObj(obj[key])) {
      flattenObj(obj[key], propName, res)
    } else {
      res[propName] = obj[key]
    }
  })

  return res
}

export const formatAttributeName = <T extends Object = Object>(attrs: T, prefix = "") => {
  const attributes = (Object.keys(attrs) as Array<keyof typeof attrs>).reduce((acc, key) => {
    const isId = key === "id" || key === "_id"
    return Object.assign(acc, {
      [isId ? "_id" : `${prefix}${key as string}`]: attrs[key]
    })
  }, {}) as T

  return attributes
}

export const getReturnData = <T = Object>(
  obj: T,
  options?: Partial<Record<"fields" | "without", string[]>>
) => {
  if (!obj) return obj

  // TODO:
  // if (obj._id) {
  //   obj.id = obj._id
  //   delete obj._id
  // }

  // @ts-ignore
  if (obj.toObject) obj = obj.toObject()

  const picked = isEmpty(options?.fields || []) ? obj : pick(obj, options?.fields!)
  return omit(picked, options?.without || []) as Partial<typeof obj>
}

export const getReturnList = <T = Array<any>>(
  arr: T[],
  options?: Partial<Record<"fields" | "without", string[]>>
) => (!arr.length ? arr : arr.map((ele) => getReturnData(ele, options)))

export const replacePlaceholder = (template: string, params: Record<string, string>): string => {
  Object.keys(params).forEach((k) => {
    const placeholder = `{{${k}}}`
    template = template.replace(new RegExp(placeholder, "g"), params[k])
  })

  return template
}
