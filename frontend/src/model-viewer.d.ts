import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { ModelViewerElement } from '@google/model-viewer'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': DetailedHTMLProps<HTMLAttributes<ModelViewerElement>, ModelViewerElement> & {
          src?: string
          alt?: string
          'camera-controls'?: boolean
          'auto-rotate'?: boolean
          'shadow-intensity'?: string
          exposure?: string
          'tone-mapping'?: string
          ar?: boolean
        }
      }
    }
  }
}

export {}
