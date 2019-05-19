import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { User } from './common'
import { HUD } from './HUD'

export default class App {
    private users: Array<User> = []
    private huds: Array<HUD> = []

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())

        this.context.onUserJoined((user) => this.userJoined(user))        
        this.context.onUserLeft((user) => this.userLeft(user))        
    }

    private started() {
    }

    private userJoined = async (mreUser: MRESDK.User) => {
        let user = new User(mreUser.id, mreUser.name)
        this.users.push(user)

        let hud = new HUD(this.context, this.baseUrl)
        await hud.attachTo(user)
        this.huds.push(hud)

        for (let hud of this.huds) {
            await hud.update(this.users)
        }
    }

    private userLeft = async (mreUser: MRESDK.User) => {
        this.users = this.users.filter(user => user.id != mreUser.id)

        for (let hud of this.huds) {
            await hud.update(this.users)
        }
    }
}
    