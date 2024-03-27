import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import { arch, platform } from 'process'
import axios from 'axios'

export async function run(): Promise<void> {
  try {
    let version: string = core.getInput('version')

    if (!version || version.toLowerCase() === 'latest') {
      const { data } = await axios.get(
        'https://api.github.com/repos/direnv/direnv/releases/latest'
      )
      version = data.tag_name.slice(1)
    }

    const architecture = arch === 'x64' ? 'amd64' : arch
    switch (platform) {
      case 'linux':
      case 'darwin':
        break
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }

    const cache = tc.find('direnv', `${version}-${platform}-${architecture}`)
    if (cache) {
      core.addPath(cache)
      return
    }
    const url = `https://github.com/direnv/direnv/releases/download/v${version}/direnv.${platform}-${architecture}`

    // Download the binary
    const downloadPath = await tc.downloadTool(url)

    // Make the binary executable
    await exec.exec(`chmod +x ${downloadPath}`)

    // Add the binary to the tool cache
    const cachedPath = await tc.cacheFile(
      downloadPath,
      'direnv',
      'direnv',
      `${version}-${platform}-${architecture}`
    )

    // Add the binary to the PATH
    core.addPath(cachedPath)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
