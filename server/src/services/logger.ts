import winston from 'winston'

export const makeLoggerService = () => {
  return winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  })
}

export type Logger = ReturnType<typeof makeLoggerService>
