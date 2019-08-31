import React, { useRef } from "react"
import { useThree, useRender, extend } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

extend({ OrbitControls })

const Controls = props => {
  const { camera, scene } = useThree()
  const ref = useRef()

  useRender(() => {
    ref.current && ref.current.update()
    scene.scale.set(0.25, 0.25, 0.25)
  })

  return <orbitControls ref={ref} args={[camera]} {...props} />
}

export default Controls
