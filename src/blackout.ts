import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'

export class Blackout {
    static readonly outwardFacingSphereResourceId = "artifact: 1210501799002243731"
    static readonly inwardFacingSphereResourceId = "artifact: 1210501805352419988"
    static readonly durationInMilliseconds = 5000 

    private interval: NodeJS.Timeout

    constructor(private context: MRESDK.Context) {
    }

    public drawPlane(user: User) {
        user.isBlackedOut = true

        user.blackoutOutwardFacingSphereActor = MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Blackout.outwardFacingSphereResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0.0, y: 0.0, z: 0.0 },
                        scale: { x: 0.5, y: 0.5, z: 0.5 }
                    },
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'head'
                }    
            }
        }).value

        user.blackoutInwardFacingSphereActor = MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: Blackout.inwardFacingSphereResourceId,
            actor: {
                transform: {
                    local: {
                        position: { x: 0.0, y: 0.0, z: 0.0 },
                        scale: { x: 0.49, y: 0.49, z: 0.49 }
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
            user.blackoutOutwardFacingSphereActor.destroy()
            user.blackoutInwardFacingSphereActor.destroy()
        }, Blackout.durationInMilliseconds)
    }
}

