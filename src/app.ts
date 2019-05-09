import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

export default class App {
    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())
    }

    private started() {
    }
}
    