import {Label} from '@sx/iterations/contracts/iteration-interface'


export default interface BaseCreateData {
    [key: string]: string | number | boolean | Date | null | string[] | number[] | Label[] | undefined
}