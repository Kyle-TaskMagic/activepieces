import { ActivepiecesError, ErrorCode } from '@activepieces/shared'
import { SystemProp } from './system-prop'

const systemPropDefaultValues: Record<string, string> = {
    [SystemProp.SIGN_UP_ENABLED]: 'false',
    [SystemProp.TELEMETRY_ENABLED]: 'true',
    [SystemProp.SANDBOX_RUN_TIME_SECONDS]: '600',
    [SystemProp.QUEUE_MODE]: 'MEMORY',
    [SystemProp.DB_TYPE]: 'SQLITE3',
    [SystemProp.EXECUTION_MODE]: 'UNSANDBOXED',
    [SystemProp.TRIGGER_DEFAULT_POLL_INTERVAL]: '5',
    [SystemProp.FLOW_WORKER_CONCURRENCY]: '10',
    [SystemProp.CLOUD_AUTH_ENABLED]: 'true',
    [SystemProp.STATS_ENABLED]: 'false',
    [SystemProp.EDITION]: 'ce',
    [SystemProp.TEMPLATES_SOURCE_URL]: 'https://cloud.activepieces.com/api/v1/flow-templates',
    [SystemProp.ENVIRONMENT]: 'prod',
    [SystemProp.ENGINE_EXECUTABLE_PATH]: 'dist/packages/engine/main.js',
    

}

export const system = {
    get(prop: SystemProp): string | undefined {
        return getEnvVar(prop) ?? systemPropDefaultValues[prop]
    },

    getNumber(prop: SystemProp): number | null {
        const stringNumber = getEnvVar(prop)

        if (!stringNumber) {
            return null
        }

        const parsedNumber = Number.parseInt(stringNumber, 10)

        if (Number.isNaN(parsedNumber)) {
            return null
        }

        return parsedNumber
    },

    getBoolean(prop: SystemProp): boolean | undefined {
        const env = getEnvVar(prop)
        if (env === undefined) {
            return undefined
        }
        return getEnvVar(prop) === 'true'
    },

    getOrThrow(prop: SystemProp): string {
        const value = getEnvVar(prop)

        if (value === undefined) {
            throw new ActivepiecesError({
                code: ErrorCode.SYSTEM_PROP_NOT_DEFINED,
                params: {
                    prop,
                },
            }, `System property AP_${prop} is not defined, please check the documentation`)
        }

        return value
    },
}

const getEnvVar = (prop: SystemProp): string | undefined => {
    return process.env[`AP_${prop}`]
}

export const validateEnvPropsOnStartup = () => {
    const encryptionKey = system.getOrThrow(SystemProp.ENCRYPTION_KEY)
    const encryptionKeyLength = Buffer.from(encryptionKey, 'binary')
    if (encryptionKeyLength.length !== 32) {
        throw new ActivepiecesError({
            code: ErrorCode.SYSTEM_PROP_INVALID,
            params: {
                prop: SystemProp.ENCRYPTION_KEY,
            },
        }, `System property AP_${SystemProp.ENCRYPTION_KEY} must be 256 bit (32 hex charaters)`)
    }

    const executionMode = system.get(SystemProp.EXECUTION_MODE)
    const signedUpEnabled = system.getBoolean(SystemProp.SIGN_UP_ENABLED) ?? false
    if (executionMode === ExecutionMode.UNSANDBOXED && signedUpEnabled) {
        throw new ActivepiecesError({
            code: ErrorCode.SYSTEM_PROP_INVALID,
            params: {
                prop: SystemProp.EXECUTION_MODE,
            },
        }, 'Allowing users to sign up is not allowed in unsandboxed mode, please check the configuration section in the documentation')
    }
}

export enum ExecutionMode {
    SANDBOXED = 'SANDBOXED',
    UNSANDBOXED = 'UNSANDBOXED',
}