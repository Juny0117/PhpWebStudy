import is from 'electron-is'
import path from 'path'
import { ViteDevPort } from '../../../configs/vite.port.ts'
const index = path.resolve(__dirname, '../render/index.html')
export default {
  index: {
    attrs: {
      title: 'WebMaker',
      width: 1200,
      height: 800,
      minWidth: 1200,
      minHeight: 800,
      backgroundColor: '#262D3D',
      transparent: !is.windows()
    },
    bindCloseToHide: true,
    url: is.dev() ? `http://localhost:${ViteDevPort}` : `file://${index}`
  }
}
