module.exports = (app) => {
    /**
    * @memberof fg.components
    */
    const CallSwitch = {
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({
            activateOrDeleteCall: function(call) {
                // Remove the new call when clicking on the new Call while
                // it is active.
                if (call.active && call.status === 'new') {
                    app.emit('bg:calls:call_delete', {callId: call.id})
                } else {
                    // Otherwise it's just activated.
                    app.emit('bg:calls:call_activate', {
                        callId: call.id,
                        holdInactive: false,
                        unholdActive: false,
                    })
                }
            },
            callIcon: function(call) {
                if (call.status === 'new') {
                    if (call.active) return 'close'
                    else return 'dialpad'
                } else if (['bye', 'rejected_a', 'rejected_b'].includes(call.status)) {
                    return 'hang-up'
                } else {
                    if (call.status === 'invite') return 'incoming-call'
                    else if (call.status === 'create') return 'outgoing-call'
                    else if (call.hold.active) return 'on-hold'
                    return 'phone'
                }
            },
            callTitle: function(call) {
                const translations = app.helpers.getTranslations().call
                if (call.status === 'new') {
                    if (call.active) return this.$t('Close new call')
                    else return `${this.$t('Select new Call')}`
                } else {
                    let text = `${call.number} - `
                    if (call.status === 'accepted') {
                        if (call.hold.active) text += translations[call.status].hold
                        else text += translations[call.status][call.type]
                    } else {
                        text += translations[call.status]
                    }

                    return text
                }
            },
            classes: function(call, block) {
                let classes = {}
                if (block === 'call-button') {
                    classes.active = call.active
                    if (call.status === 'new') {
                        classes['new-call'] = true
                    } else {
                        if (['bye', 'rejected_a', 'rejected_b'].includes(call.status)) {
                            classes['state-hangup'] = true
                        } else {
                            classes['state-active'] = true
                        }

                        if (call.transfer.type === 'accept') classes.hint = true
                    }
                }
                return classes
            },
            newCallAllowed: function() {
                let available = true
                for (let callId of Object.keys(this.calls)) {
                    if (['new', 'create', 'invite'].includes(this.calls[callId].status)) {
                        available = false
                    }
                }
                return available
            },
        }, app.helpers.sharedMethods()),
        render: templates.call_switch.r,
        staticRenderFns: templates.call_switch.s,
        store: {
            calls: 'calls.calls',
            user: 'user',
        },
    }

    return CallSwitch
}