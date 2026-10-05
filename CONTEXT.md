# Morrow product context

## Goal and scope

Help people decide where to go in Richmond, BC using place-linked experiences, contextual tastes and intent, and people they follow. The MVP covers food, drink, coffee, outdoors, and culture. An invited Richmond closed beta should validate weekly return and meaningful discovery, with team-agreed week-four thresholds.

People can browse without signing in. Saving, sharing, following, and profile editing require an account. Discovery offers Feed and Map surfaces; Following is a discovery destination. Sharing begins with deliberate map selection or pin confirmation, followed by a photo or caption, optional contextual tags, and visibility controls.

## Language

- **Place**: a location with an identifier, category, coordinates, provenance, verification state, and optional address. A place is distinct from an experience at that place.
- **Experience**: a place-linked moment with a photo or caption, contextual tags, and a visibility choice. Use experience rather than post or review in product/domain descriptions.
- **Follower**: an account that follows another account and can read that author's follower-visible experiences. The UI identifies mutual follows as friends; this is a derived relationship, not a separate contact system.
- **Follower-visible experience**: readable by its author and the author's followers. It is not a public experience.
- **Private experience**: readable only by its author.
- **Public profile**: a discoverable account profile. Profile visibility does not make that account's experiences public.
- **Provisional place**: a community-suggested location awaiting verification. A precise dropped pin does not establish a verified name or address.
- **Contextual heart**: agreement with an experience in a similar context, used as a ranking signal. The current implementation has scoring/count support but lacks an end-to-end agreement write flow.

## Product boundaries

Default experience location disclosure is the area, with exact-place sharing an explicit choice. Morrow does not share live location. Keep follower/private visibility and profile visibility separate, and preserve block/report behavior.

Pin addresses are supplied and confirmed by the person; the app does not automatically call Places or Geocoding. Launch categories describe the present catalogue, not a permanent taxonomy.

## Implementation versus intent

The code currently combines bundled sample experiences with authenticated experiences and stores provisional places locally. These are current limitations, not the target shared-data model. See [project status](docs/project-status.md) for gaps and [architecture](docs/architecture.md) for implementation details.
