import { BaseModelSchema } from "@activepieces/shared";
import { Static, Type } from "@sinclair/typebox";

export enum CustomDomainStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING"
}

export const CustomDomain = Type.Object({
    ...BaseModelSchema,
    domain: Type.String(),
    platformId: Type.String(),
    status: Type.Enum(CustomDomainStatus),
})

export type CustomDomain = Static<typeof CustomDomain>;


export const CreateDomainRequest = Type.Object({
    domain: Type.String(),
})

export type CreateDomainRequest = Static<typeof CreateDomainRequest>;

export const ListCustomDomainsRequest = Type.Object({
    limit: Type.Optional(Type.Number()),
    cursor: Type.Optional(Type.String()),
})

export type ListCustomDomainsRequest = Static<typeof ListCustomDomainsRequest>;