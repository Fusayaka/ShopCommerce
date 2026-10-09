import { type Comment } from '@/types'

// userId -> display info (the subset of the users seed shown on a comment card).
const USERS: Record<number, { name: string; avatar: string }> = {
  1000: { name: "Minh Nguyen", avatar: "https://i.pravatar.cc/150?img=11" },
  1001: { name: "Lan Pham", avatar: "https://i.pravatar.cc/150?img=5" },
  1002: { name: "Hoang Tran", avatar: "https://i.pravatar.cc/150?img=15" },
  1003: { name: "Trang Le", avatar: "https://i.pravatar.cc/150?img=20" },
  1004: { name: "Khoa Vu", avatar: "https://i.pravatar.cc/150?img=33" },
  1005: { name: "Linh Bui", avatar: "https://i.pravatar.cc/150?img=44" },
  1006: { name: "Tuan Do", avatar: "https://i.pravatar.cc/150?img=55" },
  1007: { name: "Ngoc Dang", avatar: "https://i.pravatar.cc/150?img=66" },
  1008: { name: "Dat Ngo", avatar: "https://i.pravatar.cc/150?img=77" },
  1009: { name: "Huyen Ly", avatar: "https://i.pravatar.cc/150?img=88" },
};

// [productId, userId, content, rating] — mirrors the comments seed (section 6).
// Products 4, 17, 22, 30 intentionally have no rows (rating 0 -> "New").
const RAW_COMMENTS: [number, number, string, number][] = [
  // Product 1: many reviews, high rating
  [1, 1001, "Super comfortable and the fabric feels premium.", 5],
  [1, 1002, "Fits true to size and the color is great.", 5],
  [1, 1003, "Really nice shirt, would buy again.", 4],
  [1, 1004, "Best basic tee I own right now.", 5],
  [1, 1005, "Soft, breathable and well made.", 4],
  [1, 1006, "Love it, washes well with no shrinking.", 5],
  [1, 1007, "Great value, looks more expensive than it is.", 5],
  // Product 2: many reviews, high rating
  [2, 1008, "Excellent quality cotton, very soft.", 5],
  [2, 1009, "Clean white, exactly like the photo.", 4],
  [2, 1000, "Fits perfectly and feels durable.", 5],
  [2, 1001, "Comfortable for all-day wear.", 4],
  [2, 1002, "Great shirt, highly recommend.", 5],
  // Product 3: low-medium
  [3, 1003, "Thinner than expected for the price.", 2],
  [3, 1004, "It is okay, nothing special.", 3],
  [3, 1005, "Fabric felt a bit rough after washing.", 2],
  // Product 5: medium
  [5, 1006, "Decent shirt but the fit is a little boxy.", 3],
  [5, 1007, "Comfortable enough for everyday use.", 4],
  [5, 1008, "Average quality, does the job.", 3],
  [5, 1009, "Nice and soft, happy with it.", 4],
  // Product 6: single review
  [6, 1000, "Classic fit and good quality.", 4],
  // Product 7: many reviews, high rating
  [7, 1001, "The gray is a perfect neutral, love it.", 5],
  [7, 1002, "Top notch fabric and stitching.", 5],
  [7, 1003, "Very comfortable, slightly long but fine.", 4],
  [7, 1004, "My new favorite everyday tee.", 5],
  [7, 1005, "Great quality for the price.", 5],
  [7, 1006, "Good shirt, fits as expected.", 4],
  // Product 8: medium
  [8, 1007, "The green is nice but the fabric is thin.", 3],
  [8, 1008, "Comfortable and good color.", 4],
  [8, 1009, "Fits well, decent material.", 4],
  [8, 1000, "Okay for the price, nothing amazing.", 3],
  // Product 9: two reviews
  [9, 1007, "The beige color is easy to match.", 4],
  [9, 1008, "Comfortable for casual outfits.", 4],
  // Product 10: two reviews
  [10, 1001, "Clean, minimal and very comfortable.", 5],
  [10, 1002, "Good gray tee, soft fabric.", 4],
  // Product 11: three reviews, high rating
  [11, 1001, "Nice navy color and great quality.", 5],
  [11, 1002, "Fits nicely and looks clean.", 4],
  [11, 1003, "Really solid everyday shirt.", 5],
  // Product 12: single review
  [12, 1003, "Oversized fit is fine but runs very large.", 3],
  // Product 13: many reviews, high rating
  [13, 1004, "Perfect black tee, goes with everything.", 5],
  [13, 1005, "Great fabric, holds its shape well.", 4],
  [13, 1006, "Excellent quality, very comfortable.", 5],
  [13, 1007, "Love the fit and the material.", 5],
  [13, 1008, "Solid basic, would rebuy.", 4],
  [13, 1009, "Best black shirt I have bought.", 5],
  // Product 14: two reviews
  [14, 1007, "The blue is nice but a bit thin.", 3],
  [14, 1008, "Decent casual style.", 4],
  // Product 15: two reviews
  [15, 1000, "Soft cotton and light, very nice.", 4],
  [15, 1001, "Super comfortable, great for summer.", 5],
  // Product 16: medium-low
  [16, 1002, "Color faded a bit after one wash.", 2],
  [16, 1003, "It is alright, the fit is a bit off.", 3],
  [16, 1004, "Not as thick as I hoped.", 2],
  // Product 18: many reviews, low rating
  [18, 1005, "Overpriced for the quality.", 1],
  [18, 1006, "Fabric feels cheap, disappointed.", 2],
  [18, 1007, "Shrunk after the first wash.", 1],
  [18, 1008, "Not worth the premium price.", 2],
  [18, 1009, "Would not buy again.", 1],
  // Product 19: single review
  [19, 1007, "Simple, clean and comfortable.", 4],
  // Product 20: medium
  [20, 1000, "The green is duller than the photo.", 2],
  [20, 1001, "Okay shirt, average fit.", 3],
  [20, 1002, "Comfortable but a bit thin.", 3],
  // Product 21: low rating
  [21, 1003, "Heavy fabric but the stitching came loose.", 2],
  [21, 1004, "Fell apart too quickly.", 1],
  [21, 1005, "Not as durable as advertised.", 2],
  [21, 1006, "Disappointed with the quality.", 2],
  // Product 23: two reviews
  [23, 1007, "Nice sporty fit, good for workouts.", 4],
  [23, 1008, "Decent but a little stiff at first.", 3],
  // Product 24: two reviews
  [24, 1009, "Relaxed fit is really comfortable.", 4],
  [24, 1000, "Good casual shirt, fits well.", 4],
  // Product 25: single review
  [25, 1001, "Simple and perfect, exactly what I wanted.", 5],
  // Product 26: low rating
  [26, 1002, "The olive looks washed out.", 2],
  [26, 1003, "Material is thinner than expected.", 2],
  // Product 27: many reviews, low rating
  [27, 1004, "Way overpriced for what you get.", 1],
  [27, 1005, "Poor quality, felt cheap.", 1],
  [27, 1006, "Not premium at all.", 2],
  [27, 1007, "Disappointed, returned it.", 1],
  [27, 1008, "Fabric pilled after one wear.", 2],
  [27, 1009, "Would not recommend.", 1],
  // Product 28: mixed, low-medium
  [28, 1005, "The beige looks a little dull.", 2],
  [28, 1006, "Okay shirt, average quality.", 3],
  // Product 29: two reviews
  [29, 1000, "The navy is nice but the fit is average.", 3],
  [29, 1001, "Okay shirt for the price.", 3],
];

let commentId = 1;

const mockComments: Comment[] = RAW_COMMENTS.map(([productId, userId, content, rating]) => ({
  id: commentId++,
  productId,
  userId,
  content,
  rating,
  user: { id: userId, ...USERS[userId] },
}));

export default mockComments;
