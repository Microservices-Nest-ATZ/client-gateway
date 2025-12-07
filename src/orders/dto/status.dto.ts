import { IsEnum } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";


export class StatusDto {

    @IsEnum(OrderStatusList, {
        message: `Possible values ${Object.values(OrderStatusList).join(', ')}`,
    })
    status?: OrderStatusList;
}