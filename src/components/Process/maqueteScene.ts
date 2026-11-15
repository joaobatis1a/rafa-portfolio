import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'

/**
 * Maquete de estudo de uma loja que se constrói em cinco etapas:
 * 1 envoltória e cotas · 2 zonas e percurso · 3 paredes e mobiliário ·
 * 4 detalhamento (superfícies translúcidas, arestas em destaque) · 5 materiais e luzes.
 * É uma maquete esquemática do método (a mesma planta da prancha), não um projeto real.
 */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (x: number) => {
  const t = clamp01(x)
  return t * t * (3 - 2 * t)
}

export interface Maquete {
  setStage: (n: number) => void
  dispose: () => void
}

export function createMaquete(container: HTMLElement, canvas: HTMLCanvasElement): Maquete {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  // 1.5 é visualmente indistinguível de 2 nesta cena e reduz bastante o custo por quadro
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap

  const scene = new Scene()
  scene.background = new Color('#ede8df')
  const camera = new PerspectiveCamera(28, 1.6, 0.1, 300)
  const pivot = new Group()
  scene.add(pivot)
  const root = new Group()
  root.position.set(-6, 0, -3.75)
  pivot.add(root)

  const hemi = new HemisphereLight(0xffffff, 0xb8ad9c, 1.5)
  scene.add(hemi)
  const sun = new DirectionalLight(0xffffff, 1.7)
  sun.position.set(-8, 16, 10)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 50 })
  sun.shadow.bias = -0.0008
  scene.add(sun)

  // Materiais com cor "maquete branca" (a) e cor final (b)
  // solid = não fica translúcido no detalhamento (base e piso continuam opacos)
  const tinted: { m: MeshStandardMaterial; a: Color; b: Color; solid: boolean }[] = []
  const mat = (a: string, b: string, solid = false) => {
    const m = new MeshStandardMaterial({ color: a, roughness: 0.88, metalness: 0, transparent: !solid })
    tinted.push({ m, a: new Color(a), b: new Color(b), solid })
    return m
  }
  const lineMat = new LineBasicMaterial({ color: 0x171715, transparent: true, opacity: 0.8 })
  const mk = (geo: BufferGeometry, m: Material, edges = true) => {
    const mesh = new Mesh(geo, m)
    mesh.castShadow = true
    mesh.receiveShadow = true
    if (edges) mesh.add(new LineSegments(new EdgesGeometry(geo), lineMat))
    root.add(mesh)
    return mesh
  }

  const W = 12
  const D = 7.5
  const TH = 0.2

  // Base da maquete e piso
  const baseG = new BoxGeometry(W + 3.2, 0.35, D + 3.2)
  baseG.translate(0, -0.295, 0)
  mk(baseG, mat('#e2dbce', '#e2dbce', true)).position.set(W / 2, 0, D / 2)
  const floorG = new BoxGeometry(W, 0.12, D)
  floorG.translate(0, -0.06, 0)
  mk(floorG, mat('#f1ede5', '#a98564', true)).position.set(W / 2, 0, D / 2)

  // Paredes (com vão de porta) e pilar
  const wallMat = mat('#f6f3ed', '#ebe4d7')
  const walls: Mesh[] = []
  const wallSegs: [number, number, number, number][] = [
    [0, 0, 12, 0],
    [0, 0, 0, 7.5],
    [12, 0, 12, 7.5],
    [0, 7.5, 4.75, 7.5],
    [6.25, 7.5, 12, 7.5],
  ]
  wallSegs.forEach(([x1, z1, x2, z2]) => {
    const horiz = z1 === z2
    const len = Math.hypot(x2 - x1, z2 - z1) + TH
    const g = new BoxGeometry(horiz ? len : TH, 1, horiz ? TH : len)
    g.translate(0, 0.5, 0)
    const m = mk(g, wallMat)
    m.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2)
    walls.push(m)
  })
  const pilG = new BoxGeometry(0.35, 1, 0.35)
  pilG.translate(0, 0.5, 0)
  const pillar = mk(pilG, mat('#f6f3ed', '#cfc4b3'))
  pillar.position.set(9.5, 0, 4.25)
  walls.push(pillar)

  // Zonas de uso no piso
  const zoneDefs: [number, number, number, number, string][] = [
    [0.5, 0.55, 5, 2.95, '#c9b89c'],
    [6, 0.55, 5.5, 3, '#bba98e'],
    [8.5, 4.75, 3, 2.25, '#a99a82'],
    [0.5, 4.5, 3.25, 2.5, '#d3c4ad'],
  ]
  const zones = zoneDefs.map(([x, z, w, d, c]) => {
    const m = new Mesh(
      new PlaneGeometry(w, d),
      new MeshBasicMaterial({ color: c, transparent: true, opacity: 0, depthWrite: false }),
    )
    m.rotation.x = -Math.PI / 2
    m.position.set(x + w / 2, 0.015, z + d / 2)
    root.add(m)
    return m
  })

  // Percurso do cliente
  const curve = new CatmullRomCurve3(
    [[5.5, 8.2], [5.5, 5.75], [5.1, 4.6], [4.15, 3.25], [5.0, 2.4], [7.25, 2.2]].map(
      ([x, z]) => new Vector3(x, 0.05, z),
    ),
  )
  const flowMat = new MeshBasicMaterial({ color: 0x6f6352, transparent: true })
  const flow = new Mesh(new TubeGeometry(curve, 160, 0.055, 8, false), flowMat)
  root.add(flow)
  const flowTotal = flow.geometry.index!.count
  const arrow = new Mesh(new ConeGeometry(0.16, 0.42, 16), flowMat)
  arrow.position.copy(curve.getPoint(1))
  arrow.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), curve.getTangent(1).normalize())
  root.add(arrow)

  // Mobiliário: [cx, cz, largura, profundidade, altura, cor final]
  const furnDefs: [number, number, number, number, number, string][] = [
    [0.3, 2.0, 0.3, 2.8, 1.8, '#f7f4ee'],
    [3.875, 0.3, 6.25, 0.3, 1.8, '#f7f4ee'],
    [1.975, 2.0, 1.35, 0.65, 0.9, '#c8b28e'],
    [1.975, 2.95, 1.35, 0.65, 0.9, '#c8b28e'],
    [5.675, 2.675, 2.75, 0.85, 1.0, '#2a2926'],
    [10.35, 6.35, 2.3, 0.7, 1.05, '#2a2926'],
    [2.75, 6.25, 1.5, 1.0, 0.75, '#8a6a4b'],
  ]
  const furniture = furnDefs.map(([x, z, w, d, h, c]) => {
    const g = new BoxGeometry(w, h, d)
    g.translate(0, h / 2, 0)
    const m = mk(g, mat('#fbf9f5', c))
    m.position.set(x, 0, z)
    m.scale.y = 0.001
    m.visible = false
    return m
  })

  // Cotas
  const dimPts: Vector3[] = []
  const seg = (a: [number, number, number], b: [number, number, number]) =>
    dimPts.push(new Vector3(...a), new Vector3(...b))
  seg([0, 0.02, -1], [12, 0.02, -1])
  seg([-0.15, 0.02, -0.85], [0.15, 0.02, -1.15])
  seg([11.85, 0.02, -0.85], [12.15, 0.02, -1.15])
  seg([-1, 0.02, 0], [-1, 0.02, 7.5])
  seg([-0.85, 0.02, -0.15], [-1.15, 0.02, 0.15])
  seg([-0.85, 0.02, 7.35], [-1.15, 0.02, 7.65])
  seg([0, 0.02, -0.7], [0, 0.02, -1.3])
  seg([12, 0.02, -0.7], [12, 0.02, -1.3])
  seg([-0.7, 0.02, 0], [-1.3, 0.02, 0])
  seg([-0.7, 0.02, 7.5], [-1.3, 0.02, 7.5])
  const dimMat = new LineBasicMaterial({ color: 0x171715, transparent: true, opacity: 0 })
  root.add(new LineSegments(new BufferGeometry().setFromPoints(dimPts), dimMat))


  // Pendentes e luzes (entrega)
  const bulbMat = new MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffc98a, emissiveIntensity: 0 })
  const cordMat = new LineBasicMaterial({ color: 0x171715, transparent: true, opacity: 0 })
  const pendants = ([[5.1, 2.675], [6.25, 2.675], [10.35, 6.35], [1.975, 2.5]] as const).map(([x, z]) => {
    const bulb = new Mesh(new SphereGeometry(0.11, 16, 12), bulbMat)
    bulb.position.set(x, 2.05, z)
    bulb.visible = false
    root.add(bulb)
    root.add(new Line(new BufferGeometry().setFromPoints([new Vector3(x, 2.15, z), new Vector3(x, 3.4, z)]), cordMat))
    const light = new PointLight(0xffd29a, 0, 6, 2)
    light.position.set(x, 1.85, z)
    root.add(light)
    return { bulb, light }
  })

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let target = 1
  let s = 0
  let drag = 0
  let tilt = 0
  let running = false
  let raf = 0
  let last = performance.now()

  function update() {
    const a1 = smooth(s)
    const a2 = smooth(s - 1)
    const a3 = smooth(s - 2)
    const a4 = smooth(s - 3)
    const a5 = smooth(s - 4)
    const h = 0.02 + 0.26 * a1 + 2.12 * a3
    walls.forEach((w) => (w.scale.y = h))
    zones.forEach((z) => ((z.material as MeshBasicMaterial).opacity = 0.62 * a2 * (1 - 0.85 * a5)))
    flow.geometry.setDrawRange(0, Math.floor((flowTotal * a2) / 3) * 3)
    flowMat.opacity = 1 - 0.75 * a5
    arrow.visible = a2 > 0.97
    furniture.forEach((m, i) => {
      const v = smooth((s - 2) * 1.6 - i * 0.12)
      m.scale.y = Math.max(0.001, v)
      m.visible = v > 0.003
    })
    dimMat.opacity = 0.9 * a1 * (1 - 0.6 * a5)
    lineMat.opacity = (0.4 + 0.6 * a4) * (1 - 0.7 * a5) * Math.max(0.25, a1)
    // Detalhamento: superfícies translúcidas, arestas técnicas em destaque ("raio-x")
    const xray = a4 * (1 - a5)
    tinted.forEach(({ m, a, b, solid }) => {
      m.color.copy(a).lerp(b, a5)
      if (!solid) {
        m.opacity = 1 - 0.72 * xray
        m.depthWrite = xray < 0.5
      }
    })
    bulbMat.emissiveIntensity = 1.8 * a5
    cordMat.opacity = a5
    pendants.forEach(({ bulb, light }) => {
      bulb.visible = a5 > 0.01
      light.intensity = 9 * a5
    })
    hemi.intensity = 1.5 - 0.35 * a5
    sun.intensity = 1.6 - 0.35 * a5
  }

  function resize() {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function placeCamera() {
    // Em telas largas a maquete se desloca para a direita, deixando o texto à esquerda livre
    const wide = camera.aspect > 1.45
    pivot.position.x = wide ? 3.6 : 0
    const dist = wide ? 31 : camera.aspect < 1.2 ? 33 : 25
    const el = 0.92 + tilt
    camera.position.set(0, Math.sin(el) * dist, Math.cos(el) * dist)
    camera.lookAt(0, 0.4, wide ? 1.4 : 0.4)
  }

  function frame(now: number) {
    if (!running) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    s += (target - s) * (1 - Math.exp(-dt * (reduce ? 50 : 2.4)))
    if (Math.abs(target - s) < 0.0005) s = target
    update()
    pivot.rotation.y = -0.62 + (reduce ? 0 : Math.sin(now / 5200) * 0.22) + drag
    placeCamera()
    renderer.render(scene, camera)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  // Só renderiza enquanto estiver visível
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) {
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    } else if (!e.isIntersecting) {
      running = false
      cancelAnimationFrame(raf)
    }
  })
  io.observe(container)

  // Arrastar para girar (horizontal) e inclinar (vertical)
  let px: number | null = null
  let py = 0
  const onDown = (e: PointerEvent) => {
    px = e.clientX
    py = e.clientY
    container.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (px === null) return
    drag += (e.clientX - px) * 0.008
    tilt = Math.max(-0.35, Math.min(0.45, tilt - (e.clientY - py) * 0.004))
    px = e.clientX
    py = e.clientY
  }
  const onUp = () => {
    px = null
  }
  container.addEventListener('pointerdown', onDown)
  container.addEventListener('pointermove', onMove)
  container.addEventListener('pointerup', onUp)
  container.addEventListener('pointercancel', onUp)

  return {
    setStage(n) {
      target = n
    },
    dispose() {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      container.removeEventListener('pointerdown', onDown)
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerup', onUp)
      container.removeEventListener('pointercancel', onUp)
      scene.traverse((obj) => {
        const o = obj as Mesh
        o.geometry?.dispose()
        const m = o.material as Material | Material[] | undefined
        if (Array.isArray(m)) m.forEach((x) => x.dispose())
        else m?.dispose()
      })
      renderer.dispose()
    },
  }
}
