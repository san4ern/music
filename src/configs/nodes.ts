import { NodeOptions } from "shoukaku/types/Constants";

export default [
    {
        name: 'something.host [DE]',
        url: 'lava.link:80',
        auth: 'youshallnotpass',
        group: 'Public'
    } as NodeOptions,
    {
        name: 'Vabby [US]',
        url: 'll.vabby.fun:443',
        auth: 'youshallnotpass',
        group: 'Public',
        secure: true
    } as NodeOptions
]