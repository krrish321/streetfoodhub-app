import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function VendorItems() {
  const { vendorId } = useParams(); // vendorId = supplierId
  const [supplier, setSupplier] = useState(null);
  const { addToCart } = useContext(CartContext);

useEffect(() => {
  fetch(`http://localhost:5000/api/suppliers/${vendorId}`)
    .then(res => res.json())
    .then(data => {
      console.log("API DATA", data); // <-- Yahan lagao
      setSupplier(data);
    });
}, [vendorId]);
  

  
  if (!supplier) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl text-black font-bold mb-4">{supplier.name} - Items</h2>
      <ul>
        {supplier.items && supplier.items.length > 0 ? (
          supplier.items.map(item => (
            <li key={item._id} className="flex justify-between items-center mb-4 bg-white p-4 rounded shadow">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-500">SKU: {item.sku || item._id}</div>
              </div>
              <button
                className="bg-orange-500 text-white px-3 py-1 rounded"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No items</li>
        )}
      </ul>
    </div>
  );
}