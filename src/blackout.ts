import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'

export class Blackout {
    static readonly durationInMilliseconds = 5000 

    private interval: NodeJS.Timeout

    private blackMaterial: MRESDK.Material

    constructor(private context: MRESDK.Context) {
        this.blackMaterial = this.context.assetManager.createMaterial('black', {
            color: MRESDK.Color3.FromInts(0, 0, 0)
        }).value
    }

    public drawPlane(user: User) {
        user.isBlackedOut = true

        user.blackoutActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Plane,
                dimensions: { x: 0.3, y: 0.0, z: 0.2 }
            },
            actor: {
                appearance: { materialId: this.blackMaterial.id },
                transform: { 
                    local: {
                        position: { x: 0.0, y: 0.01, z: 0.15 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians)
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'head'
                }
            }
        }).value

        this.interval = setTimeout(() => {
            user.isBlackedOut = false
            user.blackoutActor.destroy()
        }, Blackout.durationInMilliseconds)
    }
}

