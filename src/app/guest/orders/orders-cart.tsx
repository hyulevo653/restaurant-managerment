'use client'
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils"
import { useGuestGetOrderQuery } from "@/queries/useGuest"
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { useEffect, useMemo } from "react"
import socket from "@/lib/socket"
import { PayGuestOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema"
import { toast } from "@/components/ui/use-toast"
import { OrderStatus } from "@/constants/type"

export default function OrdersCart() {
  const {data,refetch} = useGuestGetOrderQuery()
  const orders = data?.payload.data || []    

  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity
            }
          }
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity
            }
          }
        }
        return result
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0
        },
        paid: {
          price: 0,
          quantity: 0
        }
      }
    )
  }, [orders])

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      toast({
        title : "Cập nhật món ăn",
        description: `Món ăn ${data.dishSnapshot.name} (SL: ${data.quantity}) vừa được cập nhật sang trạng thái ${getVietnameseOrderStatus(data.status)}`
      })
      refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]
      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`
      })
      refetch()
    }

    socket.on('update-order', onUpdateOrder)
    socket.on('payment',onPayment)

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('payment',onPayment)
      socket.off('disconnect', onDisconnect)
      socket.off('update-order', onUpdateOrder)
    }
  }, [refetch]);


  return (
    <>
    {orders.map((order) => (
         <div key={order.id} className='flex gap-4'>
            <div className='flex-shrink-0 relative'>
              <Image
                src={order.dishSnapshot.image}
                alt={order.dishSnapshot.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
              <p className='text-xs'>{order.dishSnapshot.description}</p>
              <div className='text-xs font-semibold'>
                {formatCurrency(order.dishSnapshot.price)} x{' '}
                <Badge className='px-1'>{order.quantity}</Badge>
              </div>
            </div>
            <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Badge variant={'outline'}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
          </div>
    ))}
   {paid.quantity !== 0 && (
        <div className='sticky bottom-0 '>
          <div className='w-full flex space-x-4 text-xl font-semibold'>
            <span>Đơn đã thanh toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}  
    <div className='sticky bottom-0 '>
        <div className='w-full flex space-x-4 text-xl font-semibold'>
          <span>Đơn chưa thanh toán · {waitingForPaying.quantity} món</span>
          <span>{formatCurrency(waitingForPaying.price)}</span>
        </div>
    </div>    
    </>
  )
}
