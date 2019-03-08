type callback <T> = (err?: Error, data?: T) => void
type straightCb = (err?: Error) => void
type straightProcess <InType> = (data: InType, callback: straightCb) => void
type process <InType, OutType> = (data: InType, callback: callback<OutType>) => void

export interface MapEach {
  // Without a callback it will return a promise
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>): Promise<Iterable<OutType>>
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, cb: null | undefined): Promise<Iterable<OutType>>

  // There is an optional "currency" that can be before or after the callback
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, concurrency: number): Promise<Iterable<OutType>>
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, concurrency: number, cb: null | undefined): Promise<Iterable<OutType>>
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, cb: null | undefined, concurrency: number): Promise<Iterable<OutType>>

  // If a callback is provided, no promise is returned
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, cb: callback<Iterable<OutType>>): void
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, concurrency: number, cb: callback<Iterable<OutType>>): void
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, cb: callback<Iterable<OutType>>, concurrency: number): void

}

export declare const mapEach: MapEach
