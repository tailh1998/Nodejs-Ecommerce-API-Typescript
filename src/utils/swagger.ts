import { Response, Router } from "express"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

import { logger } from "~/utils/logger"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nodejs E-Commerce API Typescript SWAGGER",
      version: process.env.npm_package_version ?? "0.0.1",
      description:
        "This is a Nodejs E-Commerce application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html"
      },
      contact: {
        name: "LHT",
        url: "https://github.com/tailh1998",
        email: "info@email.com"
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/**/routes/**/*.ts", "./src/**/models/**.ts"]
}

export const swaggerSpec = swaggerJsdoc(options)

const swaggerDocs = (app: Router) => {
  try {
    // z: Swagger Page
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: false }))

    // z: Docs in JSON format
    app.get("/swagger.json", (_, res: Response) => {
      res.setHeader("Content-Type", "application/json")
      res.send(swaggerSpec)
    })

    logger.debug(`Docs available at http://localhost:${process.env.PORT}/swagger`)
  } catch (error) {
    logger.error(error)
  }
}

export default swaggerDocs
