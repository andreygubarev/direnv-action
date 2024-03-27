import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'

export async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')

    const cache = tc.find('direnv', version)
    if (cache) {
      core.addPath(cache)
      return
    }
    const url = `https://github.com/direnv/direnv/releases/download/v${version}/direnv.linux-amd64`

    // Download the binary
    const downloadPath = await tc.downloadTool(url)

    // Make the binary executable
    await exec.exec(`chmod +x ${downloadPath}`)

    // Add the binary to the tool cache
    const cachedPath = await tc.cacheFile(
      downloadPath,
      'direnv',
      'direnv',
      version
    )

    // Add the binary to the PATH
    core.addPath(cachedPath)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
