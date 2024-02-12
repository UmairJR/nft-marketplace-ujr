import React from 'react'

const ListCardUI = ({ item, isNew , isSold, isPurchased}) => {
  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <figure className="overflow-hidden h-64">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </figure>
            <div className="card-body mt-2">
            <div className='card-title'>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    {isNew && <div className="badge badge-secondary">Newly Listed</div>}
                    {isSold && <div className="badge badge-success badge-outline">Sold</div>}
                    {isPurchased && <div className="badge badge-warning badge-outline">Purchased</div>}
                </div>
                <p className="text-gray-500">{item.description}</p>
                <div className="mt-4 flex card-actions justify-between items-center">
                    <span className="text-primary-500 font-bold text-lg">
                        {isSold && "Sold For "} {isPurchased && "Purchased For "}{item.totalPriceEther} ETH
                    </span>

                </div>
                <div className="mt-2">
                    {isSold && <p className="text-sm text-gray-600">Buyer Address: {item.buyerAddress}</p>}
                </div>
            </div>
        </div>
  )
}

export default ListCardUI
