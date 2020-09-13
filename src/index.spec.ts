import { createLogger } from "./index"
import { LogLevel } from "@activescott/diag"
import { promises as fs } from "fs"
import path from "path"

describe("createLogger", () => {
  let stamp: string = null

  beforeEach(() => {
    stamp = new Date().toISOString()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test("logger is not null", () => {
    const logger = createLogger("test-name", LogLevel.ERROR)
    expect(logger).toBeInstanceOf(Object)
  })

  test("honors LogLevel", async () => {
    const filePath = path.join(__dirname, "..", "honors-loglevel.log")

    // deliberately ignoring failure
    await fs.unlink(filePath).catch(() => null)

    const logger = createLogger("test-name", LogLevel.ERROR, filePath, false)
    logger.warn("foo warning" + stamp)
    logger.error("foo error " + stamp)

    // we don't have winston's filedescriptor to flush it, so we just wait 🤷‍♂️
    await sleep(500)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const log: any = JSON.parse(
      await fs.readFile(filePath, { encoding: "utf-8" })
    )
    expect(log).toBeInstanceOf(Object)
    expect(log).toHaveProperty("message", "foo error " + stamp)
    expect(log).toHaveProperty("level", "error")
  })

  // note this console.error spy doesn't work. Neither does waiting on stdout, etc. but I see the console output!?
  test("honors includeConsoleLogger", async () => {
    // crazy winston writes to this console._stderr.write ?!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const consoleErrorSpy = jest.spyOn((console as any)._stderr, "write")

    const logger = createLogger("test-name", LogLevel.ERROR, null, true)
    logger.error("foo error " + stamp)
    await sleep(500)

    expect(consoleErrorSpy).toBeCalledTimes(1)

    consoleErrorSpy.mockRestore()
  })

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
})
