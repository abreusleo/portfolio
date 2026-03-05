import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import GUI from 'lil-gui'

// ---------------------------------------------------------------------
// Debug
// ---------------------------------------------------------------------
const gui = new GUI({ width: 340, title: 'Debug UI' })
const debugObject = {}
if (window.location.hash !== '#debug') gui.hide()

// ---------------------------------------------------------------------
// Canvas & Scene
// ---------------------------------------------------------------------
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#f0ebe4')
scene.fog = new THREE.Fog('#f0ebe4', 5, 12)

gui.addColor(scene, 'background').name('Background')

// ---------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ---------------------------------------------------------------------
// Materials (Overcooked vibes – saturated, slightly toony)
// ---------------------------------------------------------------------
const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#faf8f5',
    roughness: 0.9,
    metalness: 0.0,
})

const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#d9cebf',
    roughness: 0.95,
    metalness: 0.0,
})

const woodMaterial = new THREE.MeshStandardMaterial({
    color: '#a0673c',
    roughness: 0.65,
    metalness: 0.0,
})

const darkWoodMaterial = new THREE.MeshStandardMaterial({
    color: '#6b3f22',
    roughness: 0.7,
    metalness: 0.0,
})

const metalMaterial = new THREE.MeshStandardMaterial({
    color: '#9eaab0',
    roughness: 0.35,
    metalness: 0.8,
})

const rubberMaterial = new THREE.MeshStandardMaterial({
    color: '#2a2a2a',
    roughness: 0.95,
    metalness: 0.0,
})


const redPaintMaterial = new THREE.MeshStandardMaterial({
    color: '#e74c3c',
    roughness: 0.45,
    metalness: 0.05,
})

const bluePaintMaterial = new THREE.MeshStandardMaterial({
    color: '#3498db',
    roughness: 0.45,
    metalness: 0.05,
})

const greenPaintMaterial = new THREE.MeshStandardMaterial({
    color: '#2ecc71',
    roughness: 0.45,
    metalness: 0.05,
})

const whitePaintMaterial = new THREE.MeshStandardMaterial({
    color: '#ecf0f1',
    roughness: 0.4,
    metalness: 0.05,
})

const bucketMaterial = new THREE.MeshStandardMaterial({
    color: '#7b8d9e',
    roughness: 0.4,
    metalness: 0.5,
})

const screwMaterial = new THREE.MeshStandardMaterial({
    color: '#b8b8c0',
    roughness: 0.25,
    metalness: 0.9,
})

const handleRedMaterial = new THREE.MeshStandardMaterial({
    color: '#e63946',
    roughness: 0.55,
    metalness: 0.0,
})

const handleYellowMaterial = new THREE.MeshStandardMaterial({
    color: '#f4a300',
    roughness: 0.55,
    metalness: 0.0,
})

const cardboardMaterial = new THREE.MeshStandardMaterial({
    color: '#c49a52',
    roughness: 0.85,
    metalness: 0.0,
})

const orangeMaterial = new THREE.MeshStandardMaterial({
    color: '#e67e22',
    roughness: 0.5,
    metalness: 0.0,
})

// ---------------------------------------------------------------------
// Room (smaller – 6x6x3.2)
// ---------------------------------------------------------------------
const roomWidth = 6
const roomDepth = 6
const roomHeight = 3.2

const roomGroup = new THREE.Group()
scene.add(roomGroup)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomDepth),
    floorMaterial,
)
floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true
roomGroup.add(floor)

// Ceiling
const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomDepth),
    wallMaterial,
)
ceiling.rotation.x = Math.PI * 0.5
ceiling.position.y = roomHeight
roomGroup.add(ceiling)

// Walls
const wallGeoFB = new THREE.PlaneGeometry(roomWidth, roomHeight)
const wallGeoLR = new THREE.PlaneGeometry(roomDepth, roomHeight)

const backWall = new THREE.Mesh(wallGeoFB, wallMaterial)
backWall.position.set(0, roomHeight / 2, -roomDepth / 2)
backWall.receiveShadow = true
roomGroup.add(backWall)

const frontWall = new THREE.Mesh(wallGeoFB, wallMaterial)
frontWall.position.set(0, roomHeight / 2, roomDepth / 2)
frontWall.rotation.y = Math.PI
frontWall.receiveShadow = true
roomGroup.add(frontWall)

const leftWall = new THREE.Mesh(wallGeoLR, wallMaterial)
leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0)
leftWall.rotation.y = Math.PI * 0.5
leftWall.receiveShadow = true
roomGroup.add(leftWall)

const rightWall = new THREE.Mesh(wallGeoLR, wallMaterial)
rightWall.position.set(roomWidth / 2, roomHeight / 2, 0)
rightWall.rotation.y = -Math.PI * 0.5
rightWall.receiveShadow = true
roomGroup.add(rightWall)

// Baseboards (cartoon trim along bottom of walls)
const baseboardMat = new THREE.MeshStandardMaterial({ color: '#c8bfb0', roughness: 0.8 })
const bbHeight = 0.1
const bbDepth = 0.03

function addBaseboard(w, x, y, z, ry)
{
    const bb = new THREE.Mesh(
        new THREE.BoxGeometry(w, bbHeight, bbDepth),
        baseboardMat,
    )
    bb.position.set(x, y, z)
    bb.rotation.y = ry
    roomGroup.add(bb)
}
addBaseboard(roomWidth, 0, bbHeight / 2, -roomDepth / 2 + bbDepth / 2, 0)
addBaseboard(roomWidth, 0, bbHeight / 2, roomDepth / 2 - bbDepth / 2, 0)
addBaseboard(roomDepth, -roomWidth / 2 + bbDepth / 2, bbHeight / 2, 0, Math.PI / 2)
addBaseboard(roomDepth, roomWidth / 2 - bbDepth / 2, bbHeight / 2, 0, Math.PI / 2)

// ---------------------------------------------------------------------
// Central Table (chunky, rounded – Overcooked style)
// ---------------------------------------------------------------------
const tableGroup = new THREE.Group()
scene.add(tableGroup)

const tableTopW = 1.8
const tableTopD = 1.0
const tableTopH = 0.1
const tableHeight = 0.75

// Rounded table top using a capsule-ish box via rounded edges
// We'll use a thick box + 4 sphere corners for the cartoony look
const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(tableTopW - 0.1, tableTopH, tableTopD - 0.1),
    woodMaterial,
)
tableTop.position.y = tableHeight
tableTop.castShadow = true
tableTop.receiveShadow = true
tableGroup.add(tableTop)

// Edge rounding capsules along the long sides
const edgeCapsuleGeo = new THREE.CapsuleGeometry(tableTopH / 2, tableTopW - 0.1, 6, 12)
for (const zSign of [-1, 1])
{
    const capsule = new THREE.Mesh(edgeCapsuleGeo, woodMaterial)
    capsule.rotation.z = Math.PI / 2
    capsule.position.set(0, tableHeight, zSign * (tableTopD / 2 - tableTopH / 2))
    capsule.castShadow = true
    tableGroup.add(capsule)
}

// Edge rounding capsules along the short sides
const edgeCapsuleGeoS = new THREE.CapsuleGeometry(tableTopH / 2, tableTopD - 0.1, 6, 12)
for (const xSign of [-1, 1])
{
    const capsule = new THREE.Mesh(edgeCapsuleGeoS, woodMaterial)
    capsule.rotation.x = Math.PI / 2
    capsule.position.set(xSign * (tableTopW / 2 - tableTopH / 2), tableHeight, 0)
    capsule.castShadow = true
    tableGroup.add(capsule)
}

// Chunky rounded legs
const legRadius = 0.055
const legHeight = tableHeight + tableTopH / 2
const legGeo = new THREE.CapsuleGeometry(legRadius, legHeight - legRadius * 2, 6, 12)
const legOx = tableTopW / 2 - 0.15
const legOz = tableTopD / 2 - 0.12

for (const [sx, sz] of [[1, 1], [-1, 1], [1, -1], [-1, -1]])
{
    const leg = new THREE.Mesh(legGeo, darkWoodMaterial)
    leg.position.set(sx * legOx, legHeight / 2, sz * legOz)
    leg.castShadow = true
    tableGroup.add(leg)
}

const onTable = tableHeight + tableTopH / 2

// ---------------------------------------------------------------------
// Hammer (LYING FLAT on table)
// ---------------------------------------------------------------------
const hammerGroup = new THREE.Group()
hammerGroup.position.set(-0.4, onTable, 0.15)
hammerGroup.rotation.y = 0.6
scene.add(hammerGroup)

// Handle – capsule lying on Z axis
const hammerHandle = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.025, 0.30, 6, 12),
    woodMaterial,
)
hammerHandle.rotation.z = Math.PI / 2   // lay flat
hammerHandle.position.set(0, 0.025, 0)
hammerHandle.castShadow = true
hammerGroup.add(hammerHandle)

// Rubber grip
const hammerGrip = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.03, 0.1, 6, 12),
    rubberMaterial,
)
hammerGrip.rotation.z = Math.PI / 2
hammerGrip.position.set(-0.14, 0.025, 0)
hammerGroup.add(hammerGrip)

// Head – rounded box shape (sphere-ish for cartoony)
const hammerHead = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.04, 0.08, 6, 12),
    metalMaterial,
)
hammerHead.rotation.x = Math.PI / 2  // orient head perpendicular
hammerHead.position.set(0.19, 0.04, 0)
hammerHead.castShadow = true
hammerGroup.add(hammerHead)

// ---------------------------------------------------------------------
// Warning paper sheet on table (hammer head holds the far corner)
// ---------------------------------------------------------------------
// Hammer head world ≈ (-0.243, onTable+0.04, 0.257).
// Paper center at (-0.018, _, 0.082) → corner at (-0.243, _, 0.257) lines up.

// Canvas texture: ⚠️ emoji + "Work In Progress" text
const paperCanvas = document.createElement('canvas')
paperCanvas.width  = 512
paperCanvas.height = 400
const paperCtx = paperCanvas.getContext('2d')

// Cream background
paperCtx.fillStyle = '#f2ede0'
paperCtx.fillRect(0, 0, 512, 400)

// ⚠️ emoji
paperCtx.font = '160px serif'
paperCtx.textAlign = 'center'
paperCtx.textBaseline = 'alphabetic'
paperCtx.fillText('⚠️', 256, 210)

// "Work In Progress" label
paperCtx.font = 'bold 38px sans-serif'
paperCtx.fillStyle = '#2a2a2a'
paperCtx.fillText('Work In Progress', 256, 318)

const paperTexture = new THREE.CanvasTexture(paperCanvas)

const paperSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(0.45, 0.35),
    new THREE.MeshStandardMaterial({ map: paperTexture, roughness: 0.85, side: THREE.DoubleSide }),
)
paperSheet.rotation.x = -Math.PI / 2
paperSheet.position.set(-0.018, onTable + 0.001, 0.082)
paperSheet.receiveShadow = true
scene.add(paperSheet)

// ---------------------------------------------------------------------
// Screwdriver 1 (Phillips – red, lying on table)
// ---------------------------------------------------------------------
const sd1Group = new THREE.Group()
sd1Group.position.set(0.25, onTable, -0.2)
sd1Group.rotation.y = -0.5
scene.add(sd1Group)

// Bulbous handle
const sd1Handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 12, 12),
    handleRedMaterial,
)
sd1Handle.scale.set(1, 0.7, 1)
sd1Handle.position.set(-0.08, 0.035, 0)
sd1Handle.castShadow = true
sd1Group.add(sd1Handle)

// Handle cylinder body
const sd1HandleBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.028, 0.08, 6, 12),
    handleRedMaterial,
)
sd1HandleBody.rotation.z = Math.PI / 2
sd1HandleBody.position.set(-0.04, 0.035, 0)
sd1Group.add(sd1HandleBody)

// Shaft
const sd1Shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.18, 12),
    metalMaterial,
)
sd1Shaft.rotation.z = Math.PI / 2
sd1Shaft.position.set(0.09, 0.035, 0)
sd1Shaft.castShadow = true
sd1Group.add(sd1Shaft)

// Tip
const sd1Tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.012, 0.03, 4),
    metalMaterial,
)
sd1Tip.rotation.z = -Math.PI / 2
sd1Tip.position.set(0.19, 0.035, 0)
sd1Group.add(sd1Tip)

// ---------------------------------------------------------------------
// Screwdriver 2 (Flat – yellow, lying on table)
// ---------------------------------------------------------------------
const sd2Group = new THREE.Group()
sd2Group.position.set(0.45, onTable, 0.05)
sd2Group.rotation.y = 0.3
scene.add(sd2Group)

const sd2Handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.038, 12, 12),
    handleYellowMaterial,
)
sd2Handle.scale.set(1, 0.7, 1)
sd2Handle.position.set(-0.07, 0.033, 0)
sd2Handle.castShadow = true
sd2Group.add(sd2Handle)

const sd2HandleBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.026, 0.07, 6, 12),
    handleYellowMaterial,
)
sd2HandleBody.rotation.z = Math.PI / 2
sd2HandleBody.position.set(-0.03, 0.033, 0)
sd2Group.add(sd2HandleBody)

const sd2Shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, 0.16, 12),
    metalMaterial,
)
sd2Shaft.rotation.z = Math.PI / 2
sd2Shaft.position.set(0.08, 0.033, 0)
sd2Shaft.castShadow = true
sd2Group.add(sd2Shaft)

// Flat tip
const sd2Tip = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 0.005, 0.02),
    metalMaterial,
)
sd2Tip.position.set(0.17, 0.033, 0)
sd2Group.add(sd2Tip)

// ---------------------------------------------------------------------
// Screws scattered on table (chubby cartoon screws)
// ---------------------------------------------------------------------
const screwBodyGeo = new THREE.CapsuleGeometry(0.006, 0.025, 4, 8)
const screwHeadGeo = new THREE.SphereGeometry(0.012, 8, 8)

const screwPositions = [
    { x: 0.0, z: 0.32, ry: 0.5 },
    { x: -0.15, z: 0.30, ry: 1.2 },
    { x: 0.12, z: 0.25, ry: 2.1 },
    { x: -0.25, z: -0.1, ry: 0.8 },
    { x: 0.55, z: 0.15, ry: 1.6 },
    { x: -0.5, z: 0.25, ry: 3.0 },
]

for (const sp of screwPositions)
{
    const sg = new THREE.Group()
    sg.position.set(sp.x, onTable, sp.z)
    sg.rotation.z = Math.PI / 2
    sg.rotation.y = sp.ry
    scene.add(sg)

    const body = new THREE.Mesh(screwBodyGeo, screwMaterial)
    body.position.y = 0.012
    sg.add(body)

    const head = new THREE.Mesh(screwHeadGeo, screwMaterial)
    head.scale.y = 0.5
    head.position.y = 0.03
    sg.add(head)
}


// ---------------------------------------------------------------------
// Tape roll on table
// ---------------------------------------------------------------------
const tapeRoll = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.018, 12, 20),
    new THREE.MeshStandardMaterial({ color: '#d4b44a', roughness: 0.45 }),
)
tapeRoll.position.set(-0.7, onTable + 0.018, -0.3)
tapeRoll.rotation.x = Math.PI * 0.5
tapeRoll.castShadow = true
scene.add(tapeRoll)

// ---------------------------------------------------------------------
// Paint Buckets (chubby cartoon style)
// ---------------------------------------------------------------------
function createBucket(paintMat, x, z, rotY)
{
    const g = new THREE.Group()
    g.position.set(x, 0, z)
    g.rotation.y = rotY || 0
    scene.add(g)

    const r = 0.16
    const h = 0.28

    // Body – tapered cylinder (wider at top like a real bucket)
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r * 0.82, h, 16),
        bucketMaterial,
    )
    body.position.y = h / 2
    body.castShadow = true
    body.receiveShadow = true
    g.add(body)

    // Paint fill inside (disc)
    const paintDisc = new THREE.Mesh(
        new THREE.CircleGeometry(r - 0.01, 16),
        paintMat,
    )
    paintDisc.rotation.x = -Math.PI / 2
    paintDisc.position.y = h - 0.005
    g.add(paintDisc)

    // Rim – torus
    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.012, 8, 20),
        metalMaterial,
    )
    rim.rotation.x = Math.PI / 2
    rim.position.y = h
    g.add(rim)

    // Handle
    const handle = new THREE.Mesh(
        new THREE.TorusGeometry(r * 0.7, 0.008, 8, 12, Math.PI),
        metalMaterial,
    )
    handle.position.y = h + 0.03
    handle.rotation.z = Math.PI
    handle.castShadow = true
    g.add(handle)

    return g
}

createBucket(redPaintMaterial, -1.8, -1.5, 0.3)
createBucket(bluePaintMaterial, 2.0, -1.8, -0.5)
createBucket(greenPaintMaterial, -1.5, 2.0, 1.2)
createBucket(whitePaintMaterial, 1.8, 1.8, 0.8)
createBucket(orangeMaterial, 2.2, 0.3, -0.2)

// Tipped bucket
const tipped = createBucket(bluePaintMaterial, -2.2, 0.8, 0)
tipped.rotation.x = Math.PI * 0.38
tipped.position.y = 0.08

// Paint spill – irregular blob
const spillShape = new THREE.Shape()
spillShape.moveTo(0, 0)
spillShape.bezierCurveTo(0.15, 0.05, 0.25, 0.2, 0.3, 0.15)
spillShape.bezierCurveTo(0.35, 0.05, 0.2, -0.1, 0.1, -0.12)
spillShape.bezierCurveTo(-0.05, -0.15, -0.15, -0.05, 0, 0)

const spillGeo = new THREE.ShapeGeometry(spillShape)
const spill = new THREE.Mesh(spillGeo, bluePaintMaterial)
spill.rotation.x = -Math.PI / 2
spill.position.set(-2.2, 0.005, 1.3)
spill.scale.set(1.5, 1.5, 1)
spill.receiveShadow = true
scene.add(spill)

// ---------------------------------------------------------------------
// Yellow Tarps HANGING on walls
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// Curtained Windows (back wall + right wall)
// ---------------------------------------------------------------------
const curtainMat = new THREE.MeshStandardMaterial({
    color: '#8c8c8c',
    roughness: 0.88,
    metalness: 0.0,
    side: THREE.DoubleSide,
})
const windowFrameMat = new THREE.MeshStandardMaterial({ color: '#d4c9b8', roughness: 0.7 })
const curtainRodMat = new THREE.MeshStandardMaterial({ color: '#6b6b6b', roughness: 0.3, metalness: 0.8 })

// wallX/wallZ: position of the wall plane in world space
// rotY: group rotation so local +z faces into the room
function createCurtainedWindow(wallX, wallZ, rotY)
{
    const g = new THREE.Group()
    g.position.set(wallX, 0, wallZ)
    g.rotation.y = rotY
    scene.add(g)

    const winW = 1.4
    const winH = 1.5
    const winBot = 1.2              // bottom edge of window from floor
    const winCy = winBot + winH / 2 // 1.95

    // Dark void behind glass
    const voidMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(winW, winH),
        new THREE.MeshStandardMaterial({ color: '#080810' }),
    )
    voidMesh.position.set(0, winCy, 0.005)
    g.add(voidMesh)

    // Window frame (4 bars)
    const ft = 0.055
    for (const [bw, bh, bx, by] of [
        [winW + ft * 2, ft,     0,              winBot - ft / 2         ], // bottom
        [winW + ft * 2, ft,     0,              winBot + winH + ft / 2  ], // top
        [ft,            winH,  -winW / 2 - ft / 2, winCy               ], // left
        [ft,            winH,   winW / 2 + ft / 2, winCy               ], // right
    ])
    {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, ft), windowFrameMat)
        bar.position.set(bx, by, 0.02)
        g.add(bar)
    }

    // Horizontal curtain rod
    const rodY = winBot + winH + ft + 0.15
    const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, winW + 0.6, 12),
        curtainRodMat,
    )
    rod.rotation.z = Math.PI / 2
    rod.position.set(0, rodY, 0.15)
    g.add(rod)

    // Rod end caps
    for (const sx of [-1, 1])
    {
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), curtainRodMat)
        cap.position.set(sx * (winW / 2 + 0.3), rodY, 0.15)
        g.add(cap)
    }

    // Curtain rings sliding on rod
    const ringGeo = new THREE.TorusGeometry(0.016, 0.004, 6, 12)
    for (let i = -4; i <= 4; i++)
    {
        const ring = new THREE.Mesh(ringGeo, curtainRodMat)
        ring.position.set(i * (winW / 8), rodY - 0.016, 0.15)
        ring.rotation.x = Math.PI / 2
        g.add(ring)
    }

    // Curtain fabric – hangs from rod and stops just below the window
    const curtainBottom = winBot - 0.12
    const cW = winW + 0.5
    const cH = rodY - curtainBottom
    const cGeo = new THREE.PlaneGeometry(cW, cH, 26, 14)
    const cPos = cGeo.attributes.position
    for (let i = 0; i < cPos.count; i++)
    {
        const cx = cPos.getX(i)
        const cy = cPos.getY(i)
        const t = (cy + cH / 2) / cH   // 0=bottom, 1=top
        // Pleats wider at bottom, gathered near rod at top
        const pleat = Math.sin(cx / cW * Math.PI * 10) * 0.055 * (1 - t * 0.55)
        cPos.setZ(i, pleat + 0.15)  // base offset 0.15 keeps fabric in front of frame (z=0.02)
    }
    cGeo.computeVertexNormals()
    const curtain = new THREE.Mesh(cGeo, curtainMat)
    curtain.position.set(0, curtainBottom + cH / 2, 0)
    curtain.castShadow = true
    curtain.receiveShadow = true
    g.add(curtain)
}

// Back wall  (rotY=0  → local+z = world+z = into room)
createCurtainedWindow(0.3, -roomDepth / 2, 0)

// Right wall (rotY=-π/2 → local+z = world-x = into room)
createCurtainedWindow(roomWidth / 2, -0.4, -Math.PI / 2)

// ---------------------------------------------------------------------
// Extra props
// ---------------------------------------------------------------------

// Paint roller on the floor (chubby)
const rollerGroup = new THREE.Group()
rollerGroup.position.set(1.2, 0, 1.0)
rollerGroup.rotation.y = 0.7
scene.add(rollerGroup)

const rollerHandle = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.015, 0.30, 6, 12),
    metalMaterial,
)
rollerHandle.position.y = 0.015
rollerHandle.rotation.z = Math.PI / 2
rollerHandle.castShadow = true
rollerGroup.add(rollerHandle)

const rollerHead = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.04, 0.16, 8, 16),
    new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.95 }),
)
rollerHead.position.set(0.22, 0.04, 0)
rollerHead.rotation.z = Math.PI / 2
rollerHead.castShadow = true
rollerGroup.add(rollerHead)

// Cardboard box (rounded edges – Overcooked style)
const boxGroup = new THREE.Group()
boxGroup.position.set(-2.0, 0, -2.0)
boxGroup.rotation.y = 0.4
scene.add(boxGroup)

const cBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.4, 0.4),
    cardboardMaterial,
)
cBox.position.y = 0.2
cBox.castShadow = true
cBox.receiveShadow = true
boxGroup.add(cBox)

// Open flaps – DoubleSide so they're visible from both faces
const flapMat = new THREE.MeshStandardMaterial({ color: '#c49a52', roughness: 0.85, side: THREE.DoubleSide })
const flapGeo = new THREE.PlaneGeometry(0.46, 0.20)
const flap1 = new THREE.Mesh(flapGeo, flapMat)
flap1.position.set(0, 0.42, 0.20)
flap1.rotation.x = -0.7
boxGroup.add(flap1)
const flap2 = new THREE.Mesh(flapGeo, flapMat)
flap2.position.set(0, 0.42, -0.20)
flap2.rotation.x = 0.7
boxGroup.add(flap2)

// Second closed box
const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.35, 0.38),
    cardboardMaterial,
)
box2.position.set(-2.2, 0.175, -1.5)
box2.rotation.y = -0.2
box2.castShadow = true
box2.receiveShadow = true
scene.add(box2)

// Ladder (cartoon rounded rungs)
const ladderGroup = new THREE.Group()
ladderGroup.position.set(2.4, 0, -2.3)
ladderGroup.rotation.x = -0.33  // lean toward back wall
scene.add(ladderGroup)

// Rails separated in X so both feet stay at y=0 when rotation.x is applied
const railGeo = new THREE.CapsuleGeometry(0.025, 2.0, 6, 12)
for (const xOff of [-0.18, 0.18])
{
    const rail = new THREE.Mesh(railGeo, woodMaterial)
    rail.position.set(xOff, 1.025, 0)
    rail.castShadow = true
    ladderGroup.add(rail)
}

// Rungs lie along X (rotation.z = PI/2) connecting the two rails
const rungGeo = new THREE.CapsuleGeometry(0.018, 0.32, 6, 8)
for (let i = 0; i < 5; i++)
{
    const rung = new THREE.Mesh(rungGeo, woodMaterial)
    rung.rotation.z = Math.PI / 2
    rung.position.set(0, 0.3 + i * 0.4, 0)
    rung.castShadow = true
    ladderGroup.add(rung)
}

// Small cone (traffic cone for extra cartoon construction vibe)
const coneGroup = new THREE.Group()
coneGroup.position.set(1.5, 0, -1.2)
scene.add(coneGroup)

const coneBody = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.35, 12),
    orangeMaterial,
)
coneBody.position.y = 0.175
coneBody.castShadow = true
coneGroup.add(coneBody)

// Cone base
const coneBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.02, 0.25),
    orangeMaterial,
)
coneBase.position.y = 0.01
coneGroup.add(coneBase)

// Second traffic cone
const cone2 = coneGroup.clone()
cone2.position.set(-1.0, 0, 1.8)
cone2.rotation.y = 0.6
scene.add(cone2)

// Hard hat on the floor
const hardHat = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    handleYellowMaterial,
)
// Hard hat sitting flat on the floor next to the stool
const hardHatGroup = new THREE.Group()
hardHatGroup.position.set(0.25, 0.005, 0.70)
hardHatGroup.rotation.set(0, 0.5, 0)
scene.add(hardHatGroup)

hardHat.castShadow = true
hardHatGroup.add(hardHat)

const hardHatBrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.015, 8, 20),
    handleYellowMaterial,
)
hardHatBrim.rotation.x = Math.PI / 2
hardHatGroup.add(hardHatBrim)

// Small stool near the hard hat
const stoolGroup = new THREE.Group()
stoolGroup.position.set(0, 0, 0.9)
stoolGroup.rotation.y = 0.5
scene.add(stoolGroup)

const stoolSeat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.17, 0.04, 16),
    woodMaterial,
)
stoolSeat.position.y = 0.36
stoolSeat.castShadow = true
stoolGroup.add(stoolSeat)

const stoolLegGeo = new THREE.CapsuleGeometry(0.018, 0.30, 6, 8)
for (let i = 0; i < 3; i++)
{
    const angle = (i / 3) * Math.PI * 2
    const leg = new THREE.Mesh(stoolLegGeo, darkWoodMaterial)
    leg.position.set(Math.cos(angle) * 0.13, 0.175, Math.sin(angle) * 0.13)
    leg.castShadow = true
    stoolGroup.add(leg)
}

// ---------------------------------------------------------------------
// Lights
// ---------------------------------------------------------------------
const lightsFolder = gui.addFolder('Lights')

// Ambient
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)
lightsFolder.add(ambientLight, 'intensity').min(0).max(2).step(0.01).name('Ambient')

// Central point light
const pointLight = new THREE.PointLight('#fff5e6', 12, 14, 1.5)
pointLight.position.set(0, roomHeight - 0.3, 0)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 10
scene.add(pointLight)
lightsFolder.add(pointLight, 'intensity').min(0).max(30).step(0.1).name('Point Intensity')
lightsFolder.addColor(pointLight, 'color').name('Point Color')

// Bulb
const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12),
    new THREE.MeshBasicMaterial({ color: '#fff5e6' }),
)
bulb.position.copy(pointLight.position)
scene.add(bulb)

// Fixture
const fixture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.06, 16),
    metalMaterial,
)
fixture.position.set(0, roomHeight - 0.15, 0)
scene.add(fixture)

// Wire
const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 0.15, 6),
    metalMaterial,
)
wire.position.set(0, roomHeight - 0.075, 0)
scene.add(wire)

// Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.15)
scene.add(pointLightHelper)

debugObject.showHelpers = true
lightsFolder.add(debugObject, 'showHelpers').name('Show Helpers').onChange((v) =>
{
    pointLightHelper.visible = v
})

// Fill light
const fillLight = new THREE.PointLight('#d4e5ff', 2.5, 10, 2)
fillLight.position.set(2, 2.2, 2)
scene.add(fillLight)
lightsFolder.add(fillLight, 'intensity').min(0).max(10).step(0.1).name('Fill')

// ---------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1.8, 2.5)
scene.add(camera)

// ---------------------------------------------------------------------
// Fly Controls
// ---------------------------------------------------------------------
const controls = new PointerLockControls(camera, canvas)
scene.add(controls.object)

const instructions = document.getElementById('instructions')

instructions.addEventListener('click', () => controls.lock())
controls.addEventListener('lock', () => instructions.classList.add('hidden'))
controls.addEventListener('unlock', () => instructions.classList.remove('hidden'))

const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
}

debugObject.flySpeed = 2.5
const controlsFolder = gui.addFolder('Controls')
controlsFolder.add(debugObject, 'flySpeed').min(0.5).max(10).step(0.5).name('Fly Speed')

const velocity = new THREE.Vector3()

document.addEventListener('keydown', (e) =>
{
    switch (e.code)
    {
        case 'KeyW': case 'ArrowUp':    moveState.forward = true; break
        case 'KeyS': case 'ArrowDown':  moveState.backward = true; break
        case 'KeyA': case 'ArrowLeft':  moveState.left = true; break
        case 'KeyD': case 'ArrowRight': moveState.right = true; break
        case 'Space':                   moveState.up = true; break
        case 'ShiftLeft': case 'ShiftRight': moveState.down = true; break
    }
})

document.addEventListener('keyup', (e) =>
{
    switch (e.code)
    {
        case 'KeyW': case 'ArrowUp':    moveState.forward = false; break
        case 'KeyS': case 'ArrowDown':  moveState.backward = false; break
        case 'KeyA': case 'ArrowLeft':  moveState.left = false; break
        case 'KeyD': case 'ArrowRight': moveState.right = false; break
        case 'Space':                   moveState.up = false; break
        case 'ShiftLeft': case 'ShiftRight': moveState.down = false; break
    }
})

// ---------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.1

const rendererFolder = gui.addFolder('Renderer')
rendererFolder.add(renderer, 'toneMappingExposure').min(0).max(3).step(0.01).name('Exposure')

// ---------------------------------------------------------------------
// Animation Loop
// ---------------------------------------------------------------------
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (controls.isLocked)
    {
        const speed = debugObject.flySpeed * deltaTime

        velocity.set(0, 0, 0)
        if (moveState.forward) velocity.z -= speed
        if (moveState.backward) velocity.z += speed
        if (moveState.left) velocity.x -= speed
        if (moveState.right) velocity.x += speed
        if (moveState.up) velocity.y += speed
        if (moveState.down) velocity.y -= speed

        controls.moveForward(-velocity.z)
        controls.moveRight(velocity.x)
        camera.position.y += velocity.y

        // Clamp inside room
        const m = 0.3
        camera.position.x = Math.max(-roomWidth  / 2 + m, Math.min(roomWidth  / 2 - m, camera.position.x))
        camera.position.z = Math.max(-roomDepth  / 2 + m, Math.min(roomDepth  / 2 - m, camera.position.z))
        camera.position.y = Math.max(0.3,                  Math.min(roomHeight - 0.2,   camera.position.y))
    }

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
