import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'
import { Fart } from './fart'
import { Utility } from './utility'

export class HUD {
    static readonly grayColor = new MRESDK.Color3(50.0 / 255.0, 50.0 / 255.0, 50.0 / 255.0)
    static readonly greenColor = new MRESDK.Color3(0.0 / 255.0, 100.0 / 255.0, 0.0 / 255.0)
    static readonly blueColor = new MRESDK.Color3(0.0 / 255.0, 100.0 / 255.0, 255.0 / 255.0)

    static readonly width = 1.0
    static readonly height = 1.0
    static readonly margin = 0.04
    static readonly padding = 0.03

    static readonly headerHeight = 0.06
    static readonly textHeight = 0.05

    private planeActor: MRESDK.Actor 
    private fart: Fart

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.fart = new Fart(context, baseUrl)
    }

    public attachTo(user: User) {
        this.planeActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Plane,
                dimensions: { x: HUD.width, y: 0, z: HUD.height }
            },
            actor: {
                transform: { 
                    local: {
                        position: { x: 0, y: 0, z: 2 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -60 * MRESDK.DegreesToRadians)
                    }
                },
                attachment: {
                    userId: user.id,
                    attachPoint: 'hips'
                },
                exclusiveToUser: user.id
            }
        }).value
    }

    public update(users: Array<User>) {
        for (let actor of this.planeActor.children) {
            actor.destroy()
        }

        this.addTextToHUD(this.planeActor, HUD.margin, HUD.margin, "User", HUD.grayColor, true)
        this.addTextToHUD(this.planeActor, HUD.margin + 0.35, HUD.margin, "Actions", HUD.grayColor, true)

        for (let index = 0; index < users.length; index = index + 1) {
            let user = users[index]

            this.addTextToHUD(this.planeActor, HUD.margin, HUD.margin + (index + 1) * HUD.textHeight + HUD.padding, Utility.truncate(user.name, 10), HUD.greenColor, false)

            let fartTextActor = this.addTextToHUD(this.planeActor, HUD.margin + 0.35, HUD.margin + (index + 1) * HUD.textHeight + HUD.padding, "fart", HUD.blueColor, false)
            fartTextActor.setCollider("box", false)
            
            const fartTextButtonBehavior = fartTextActor.setBehavior(MRESDK.ButtonBehavior)
            fartTextButtonBehavior.onClick('pressed', (mreUser: MRESDK.User) => {
                if (user.isFarting == false) {
                    this.fart.playSound(user)
                }
            })
        }
    }

    private addTextToHUD(hudPlane: MRESDK.Actor, x: number, y: number, contents: string, color: MRESDK.Color3, isHeader: boolean): MRESDK.Actor {
        var height: number = isHeader ? HUD.headerHeight : HUD.textHeight
        
        let textActor = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                parentId: hudPlane.id,
                transform: {
                    local: {
                        position: { 
                            x: -HUD.width / 2.0 + x, 
                            y: 0.01, 
                            z: HUD.height / 2.0 - y },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
                    }
                },
                text: {
                    contents: contents,
                    color: color,
                    height: height
                }
            }
        }).value

        return textActor
    }
}

