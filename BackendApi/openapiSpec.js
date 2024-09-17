 const openSpec={
    openapi: "3.0.3",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description:
        "API for managing users, including registration, profile updates, and authentication.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    paths:{
      summary:"Register a new user",
      requestBody:{
        content:{
          "application/json":{
            schema:{
              type:"object",
              properties:{
                username:{type:"string"},
                password:{type:"string"}
              },
              required:[
                "username",
                "password"
              ]
            }
          }
        }
      }
    }
}
module.exports={
    openSpec
}