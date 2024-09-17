import { RequestHandler } from "express"
import { ProductService } from "../services/product.service"
import { OK } from "~/core/success.response"
import { getReturnData, getReturnList } from "~/utils"
import { PRODUCT_QUERY_LIMIT_DEFAULT, PRODUCT_QUERY_SKIP_DEFAULT } from "~/constants/product"

export class ProductController {
  static createProduct: RequestHandler = async (req, res) => {
    const product = await ProductService.createProduct({
      ...req.body,
      shop: req.user.userId
    })

    new OK({
      message: "Create product successfully!!",
      metadata: {
        ...product,
        options: {}
        // link: {
        //   getAllDrafts: {
        //     href: "/api/v1/products/drafts?limit=50&skip=0",
        //     method: "GET"
        //   }
        // }
      }
    }).send(res)
  }

  static updateProduct: RequestHandler = async (req, res) => {
    const payload = req.body
    const product = await ProductService.updateProduct({
      shop: req.user.userId,
      productId: req.params.productId,
      payload
    })

    const result = getReturnData(product)

    new OK({
      message: "Update product successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        //   'search-product': { href: '/api/v1/products/:search', method: 'GET' },
        // }
      }
    }).send(res)
  }

  static deleteProduct: RequestHandler = async (req, res) => {
    const product = await ProductService.deleteProduct({
      shop: req.user.userId,
      productId: req.params.productId
    })

    const result = getReturnData(product)

    new OK({
      message: "Delete product successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        //   'search-product': { href: '/api/v1/products/:search', method: 'GET' },
        // }
      }
    }).send(res)
  }

  static restoreProduct: RequestHandler = async (req, res) => {
    const product = await ProductService.restoreProduct({
      shop: req.user.userId,
      productId: req.params.productId
    })

    const result = getReturnData(product)

    new OK({
      message: "Restore product successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        //   'search-product': { href: '/api/v1/products/:search', method: 'GET' },
        // }
      }
    }).send(res)
  }

  static getAllProducts: RequestHandler = async (req, res) => {
    const limit = (req.query.limit || PRODUCT_QUERY_LIMIT_DEFAULT) as string
    const page = (req.query.skip || PRODUCT_QUERY_SKIP_DEFAULT) as string
    const products = await ProductService.getAllProducts({ limit, page })

    const result = getReturnList(products)

    new OK({
      message: "Get all products successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: '/api/v1/products?limit=50&skip=0', method: 'GET' },
        // }
      }
    }).send(res)
  }

  static getAllDrafts: RequestHandler = async (req, res) => {
    const products = await ProductService.getAllDraftProducts({
      shop: req.user.userId
    })

    const result = getReturnList(products)

    new OK({
      message: "Get all draft products successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: "/api/v1/products/draft", method: "GET" },
        //   "search-product": { href: "/api/v1/products", method: "GET" }
        // }
      }
    }).send(res)
  }

  static getAllPublished: RequestHandler = async (req, res) => {
    const products = await ProductService.getAllPublished({
      shop: req.user.userId,
      limit: req.query.limit as string,
      page: req.query.skip as string
    })

    const result = getReturnList(products)

    new OK({
      message: "Get all published products successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: "/api/v1/products/published", method: "GET" }
        // }
      }
    }).send(res)
  }

  static publishProduct: RequestHandler = async (req, res) => {
    const product = await ProductService.publishProduct({
      shop: req.user.userId,
      productId: req.params.productId
    })

    const result = getReturnData(product)

    new OK({
      message: "Publish product successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        //   'search-product': { href: '/api/v1/products/:search', method: 'GET' },
        // }
      }
    }).send(res)
  }

  static unpublishProduct: RequestHandler = async (req, res) => {
    const product = await ProductService.unpublishProduct({
      shop: req.user.userId,
      productId: req.params.productId
    })

    const result = getReturnData(product)

    new OK({
      message: "Unpublish product successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: '/api/v1/products/:productId', method: 'PATCH' },
        //   'search-product': { href: '/api/v1/products/:search', method: 'GET' },
        // }
      }
    }).send(res)
  }

  static destroyProduct: RequestHandler = async (req, res) => {
    const deletedProduct = await ProductService.destroyProduct({
      shop: req.user.userId,
      productId: req.params.productId
    })

    const result = getReturnData(deletedProduct)

    new OK({
      message: "Action operated successfully!",
      metadata: {
        data: result
        // link: {
        //   self: { href: "/api/v1/products/:productId", method: "PATCH" },
        //   "search-product": { href: "/api/v1/products/:search", method: "GET" }
        // }
      }
    }).send(res)
  }

  static searchProducts: RequestHandler = async (req, res) => {
    const products = await ProductService.searchProducts(req.params.search as string)

    const result = getReturnList(products)

    new OK({
      message: "Search product successfully!",
      metadata: {
        ...result
        // link: {
        //   self: { href: '/api/v1/products/search/:search', method: 'GET' },
        // },
      }
    }).send(res)
  }

  static getProductDetails: RequestHandler = async (req, res) => {
    const product = await ProductService.getProductDetails(req.params.productId)

    const result = getReturnData(product)

    new OK({
      message: "Action operated successfully!",
      metadata: {
        ...result
        // link: {
        //   self: { href: "/api/v1/products/details/:productId", method: "GET" },
        //   "search-product": { href: "/api/v1/products/:search", method: "GET" }
        // }
      }
    }).send(res)
  }

  static getAllDeleted: RequestHandler = async (req, res) => {
    const deletedProducts = await ProductService.getAllDeletedProducts({
      shop: req.user.userId,
      limit: req.query.limit as string,
      page: req.query.page as string
    })

    const result = getReturnList(deletedProducts)

    new OK({
      message: "Get all deleted products successfully!",
      metadata: {
        ...result
        // link: {
        //   self: { href: "/api/v1/products/deleted", method: "GET" }
        // }
      }
    }).send(res)
  }

  static getProductDetailsForShop: RequestHandler = async (req, res) => {
    const product = await ProductService.getProductDetailsForShop({
      shop: req.user.userId,
      productId: req.params.productId
    })

    const result = getReturnData(product)

    new OK({
      message: "Action operated successfully!",
      metadata: {
        ...result
        // link: {
        //   self: { href: "/api/v1/products/:productId", method: "PATCH" },
        //   "search-product": { href: "/api/v1/products/:search", method: "GET" }
        // }
      }
    }).send(res)
  }
}
