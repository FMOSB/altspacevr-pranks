import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

export default class App {
    static readonly hudWidth = 1.0
    static readonly hudHeight = 1.0
    static readonly hudPadding = 0.05

    private hudPlanes: Array<MRESDK.Actor> = []

    private fartSoundAsset: MRESDK.Sound
    private fartSounds = new Map<string, MRESDK.Actor>();

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())

        this.context.onUserJoined((user) => this.userJoined(user))        
        this.context.onUserLeft((user) => this.userLeft(user))        
    }

    private started() {
        this.fartSoundAsset = this.context.assetManager.createSound(
            'fartSound',
            { uri: `${this.baseUrl}/fart.wav` }
        ).value

        console.log("started")
    }

    private userJoined = async (user: MRESDK.User) => {
        this.attachHUD(user)
        this.attachFartSound(user)

        for (let hudPlane of this.hudPlanes) {
            this.updateHUD(hudPlane)
        }
    }

    private userLeft = async (user: MRESDK.User) => {
        for (let hudPlane of this.hudPlanes) {
            this.updateHUD(hudPlane)
        }
    }

    private attachHUD(user: MRESDK.User) {
        const hudPlane = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Plane,
                dimensions: { x: App.hudWidth, y: 0, z: App.hudHeight }
            },
            actor: {
                transform: { 
                    local: {
                        position: { x: 0, y: 0, z: 1.5 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -60 * MRESDK.DegreesToRadians),
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
                exclusiveToUser: user.id
            }
        }).value

        this.hudPlanes.push(hudPlane)
    }

    private updateHUD(hudPlane: MRESDK.Actor) {
        for (let actor of hudPlane.children) {
            actor.destroy()
        }

        for (let index = 0; index < this.context.users.length; index = index + 1) {
            let user = this.context.users[index]

            MRESDK.Actor.CreateEmpty(this.context, {
                actor: {
                    parentId: hudPlane.id,
                    transform: {
                        local: {
                            position: { 
                                x: -App.hudWidth / 2.0 + App.hudPadding, 
                                y: 0.01, 
                                z: App.hudHeight / 2.0 - App.hudPadding },
                            rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                        }
                    },
                    text: {
                        contents: "User",
                        color: { r: 100 / 255, g: 100 / 255, b: 100 / 255 },
                        height: 0.06
                    }
                }
            })

            MRESDK.Actor.CreateEmpty(this.context, {
                actor: {
                    parentId: hudPlane.id,
                    transform: {
                        local: {
                            position: { 
                                x: -App.hudWidth / 2.0 + App.hudPadding + 0.35, 
                                y: 0.01, 
                                z: App.hudHeight / 2.0 - App.hudPadding },
                            rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                        }
                    },
                    text: {
                        contents: "Actions",
                        color: { r: 100 / 255, g: 100 / 255, b: 100 / 255 },
                        height: 0.06
                    }
                }
            })

            MRESDK.Actor.CreateEmpty(this.context, {
                actor: {
                    parentId: hudPlane.id,
                    transform: {
                        local: {
                            position: { 
                                x: -App.hudWidth / 2.0 + App.hudPadding, 
                                y: 0.01, 
                                z: App.hudHeight / 2.0 - App.hudPadding - (index + 1) / 10.0 },
                            rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                        }
                    },
                    text: {
                        contents: this.truncate(user.name, 10),
                        color: { r: 0 / 255, g: 100 / 255, b: 0 / 255 },
                        height: 0.05
                    }
                }
            })
    
            const text = MRESDK.Actor.CreateEmpty(this.context, {
                actor: {
                    parentId: hudPlane.id,
                    transform: {
                        local: {
                            position: { 
                                x: -App.hudWidth / 2.0 + App.hudPadding + 0.35, 
                                y: 0.01, 
                                z: App.hudHeight / 2.0 - App.hudPadding - (index + 1) / 10.0 },
                            rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                        }
                    },
                    text: {
                        contents: "fart",
                        color: { r: 0 / 255, g: 0 / 255, b: 255 / 255 },
                        height: 0.05
                    }
                }
            }).value
            text.setCollider("box", false)
            
            const textButtonBehavior = text.setBehavior(MRESDK.ButtonBehavior)

            textButtonBehavior.onClick('pressed', (user2: MRESDK.User) => {
                this.playFartSound(user)
            })
        }
    }

    private truncate(text: string, maxLength: number): string {
        if (text.length > maxLength) {
            return text.substr(0, maxLength - 1) + "..."
        } else {
            return text 
        }
    }

    private attachFartSound(user: MRESDK.User) {
        const sphereActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere
            },
            actor: {
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, 0.0, 0.0)
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
            }
        }).value

        this.fartSounds.set(user.id, sphereActor)
    }

    private playFartSound(user: MRESDK.User) {
        this.playBackgroundMusic()

        const sphereActor = this.fartSounds.get(user.id)

        sphereActor.startSound(this.fartSoundAsset.id, 
        {
            volume: 1.0,
            looping: false,
            doppler: 0.0,
            spread: 1.0,
            rolloffStartDistance: 0.1
        },
        0.0)
    }





    private playBackgroundMusic() {
        const sphereActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere
            },
            actor: {
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, -5.0, 0.0)
                    }
                }
            }
        }).value

        const backgroundMusicAsset = this.context.assetManager.createSound(
            'backgroundMusic',
            { uri: `${this.baseUrl}/Orbit LOOP.ogg` }
        )

        sphereActor.startSound(backgroundMusicAsset.value.id, 
        {
            volume: 0.02,
            looping: true,
            doppler: 0.0,
            spread: 1.0,
            rolloffStartDistance: 1000.0
        },
        0.0)
    }
}
    