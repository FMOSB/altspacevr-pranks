import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

export class User {
    public isFarting: boolean
    public fartSoundActor: MRESDK.Actor
    public fartCloudActor: MRESDK.Actor

    public isBlackedOut: boolean
    public blackoutActor: MRESDK.Actor

    constructor(public id: string, public name: string) {
        this.isFarting = false
        this.fartSoundActor = null
        this.fartCloudActor = null

        this.isBlackedOut = false
        this.blackoutActor = null
    }
}   
