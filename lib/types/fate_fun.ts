export type FateFun = {
  "version": "0.1.0",
  "name": "fate_fun",
  "instructions": [
    {
      "name": "createPrediction",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "eventDescription",
          "type": "string"
        },
        {
          "name": "deadline",
          "type": "i64"
        },
        {
          "name": "oracleSource",
          "type": "string"
        },
        {
          "name": "startingOdds",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "buyYes",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyNo",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolvePrediction",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resolver",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "prediction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "eventDescription",
            "type": "string"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "oracleSource",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "totalVolume",
            "type": "u64"
          },
          {
            "name": "yesSupply",
            "type": "u64"
          },
          {
            "name": "noSupply",
            "type": "u64"
          },
          {
            "name": "resolved",
            "type": "bool"
          },
          {
            "name": "outcome",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "startingOdds",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "PredictionCreated",
      "fields": [
        {
          "name": "prediction",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "eventDescription",
          "type": "string",
          "index": false
        },
        {
          "name": "deadline",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "Trade",
      "fields": [
        {
          "name": "prediction",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "side",
          "type": {
            "defined": "TradeSide"
          },
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PredictionResolved",
      "fields": [
        {
          "name": "prediction",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "outcome",
          "type": "bool",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidDeadline",
      "msg": "Invalid deadline - must be in the future"
    },
    {
      "code": 6001,
      "name": "DescriptionTooLong",
      "msg": "Description too long - max 280 characters"
    },
    {
      "code": 6002,
      "name": "MarketResolved",
      "msg": "Market already resolved"
    },
    {
      "code": 6003,
      "name": "DeadlinePassed",
      "msg": "Deadline has passed"
    },
    {
      "code": 6004,
      "name": "DeadlineNotReached",
      "msg": "Deadline not reached yet"
    },
    {
      "code": 6005,
      "name": "AlreadyResolved",
      "msg": "Prediction already resolved"
    },
    {
      "code": 6006,
      "name": "UnauthorizedResolver",
      "msg": "Unauthorized resolver"
    }
  ]
}

export const IDL: FateFun = {
  "version": "0.1.0",
  "name": "fate_fun",
  "instructions": [
    {
      "name": "createPrediction",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "eventDescription",
          "type": "string"
        },
        {
          "name": "deadline",
          "type": "i64"
        },
        {
          "name": "oracleSource",
          "type": "string"
        },
        {
          "name": "startingOdds",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "buyYes",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyNo",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolvePrediction",
      "accounts": [
        {
          "name": "prediction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resolver",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "prediction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "eventDescription",
            "type": "string"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "oracleSource",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "totalVolume",
            "type": "u64"
          },
          {
            "name": "yesSupply",
            "type": "u64"
          },
          {
            "name": "noSupply",
            "type": "u64"
          },
          {
            "name": "resolved",
            "type": "bool"
          },
          {
            "name": "outcome",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "startingOdds",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "PredictionCreated",
      "fields": [
        {
          "name": "prediction",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "eventDescription",
          "type": "string",
          "index": false
        },
        {
          "name": "deadline",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "Trade",
      "fields": [
        {
          "name": "prediction",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "side",
          "type": {
            "defined": "TradeSide"
          },
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PredictionResolved",
      "fields": [
        {
          "name": "prediction",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "outcome",
          "type": "bool",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidDeadline",
      "msg": "Invalid deadline - must be in the future"
    },
    {
      "code": 6001,
      "name": "DescriptionTooLong",
      "msg": "Description too long - max 280 characters"
    },
    {
      "code": 6002,
      "name": "MarketResolved",
      "msg": "Market already resolved"
    },
    {
      "code": 6003,
      "name": "DeadlinePassed",
      "msg": "Deadline has passed"
    },
    {
      "code": 6004,
      "name": "DeadlineNotReached",
      "msg": "Deadline not reached yet"
    },
    {
      "code": 6005,
      "name": "AlreadyResolved",
      "msg": "Prediction already resolved"
    },
    {
      "code": 6006,
      "name": "UnauthorizedResolver",
      "msg": "Unauthorized resolver"
    }
  ]
}