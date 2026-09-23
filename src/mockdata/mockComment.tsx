export interface Comment {
  id: number;
  productId: string;
  name: string;
  content: string;
  rating: number;
}

export const comments: Comment[] = [
  { id: 1, productId: "t0001", name: "Minh", content: "The shirt is comfortable and the fabric feels good.", rating: 5 },
  { id: 2, productId: "t0001", name: "An", content: "Simple design but looks really nice.", rating: 4 },

  { id: 3, productId: "t0002", name: "Khoa", content: "Good quality for the price.", rating: 5 },
  { id: 4, productId: "t0002", name: "Linh", content: "The color looks exactly like the picture.", rating: 4 },

  { id: 5, productId: "t0003", name: "Nam", content: "Very comfortable for everyday wear.", rating: 5 },
  { id: 6, productId: "t0003", name: "Huy", content: "The material feels soft and lightweight.", rating: 4 },

  { id: 7, productId: "t0004", name: "Trang", content: "I really like the simple black design.", rating: 5 },
  { id: 8, productId: "t0004", name: "Phuong", content: "Fits well and is easy to match with other clothes.", rating: 4 },

  { id: 9, productId: "t0005", name: "Long", content: "Nice shirt with a comfortable fit.", rating: 5 },
  { id: 10, productId: "t0005", name: "Mai", content: "The fabric is quite soft.", rating: 4 },

  { id: 11, productId: "t0006", name: "Duc", content: "Classic design and good quality.", rating: 4 },
  { id: 12, productId: "t0006", name: "Vy", content: "I would buy this shirt again.", rating: 5 },

  { id: 13, productId: "t0007", name: "Tuan", content: "The gray color looks great.", rating: 5 },
  { id: 14, productId: "t0007", name: "Ha", content: "Comfortable and suitable for daily wear.", rating: 4 },

  { id: 15, productId: "t0008", name: "Bao", content: "The green color is very nice.", rating: 5 },
  { id: 16, productId: "t0008", name: "Nhi", content: "Good fit and comfortable material.", rating: 4 },

  { id: 17, productId: "t0009", name: "Son", content: "The beige color is easy to match.", rating: 4 },
  { id: 18, productId: "t0009", name: "My", content: "Very comfortable for casual outfits.", rating: 5 },

  { id: 19, productId: "t0010", name: "Quan", content: "Clean and simple design.", rating: 4 },
  { id: 20, productId: "t0010", name: "Thao", content: "The shirt feels comfortable all day.", rating: 5 },

  { id: 21, productId: "t0011", name: "Hung", content: "Nice navy color and good quality.", rating: 5 },
  { id: 22, productId: "t0011", name: "Lan", content: "Fits nicely and looks clean.", rating: 4 },

  { id: 23, productId: "t0012", name: "Phuc", content: "The oversized fit is really comfortable.", rating: 5 },
  { id: 24, productId: "t0012", name: "Chi", content: "Great for a casual outfit.", rating: 4 },

  { id: 25, productId: "t0013", name: "Dat", content: "Simple black shirt that goes with everything.", rating: 5 },
  { id: 26, productId: "t0013", name: "Ngoc", content: "Good quality and comfortable fabric.", rating: 4 },

  { id: 27, productId: "t0014", name: "Kien", content: "The blue color looks really good.", rating: 5 },
  { id: 28, productId: "t0014", name: "Thuy", content: "Nice casual style.", rating: 4 },

  { id: 29, productId: "t0015", name: "Hao", content: "Very light and comfortable.", rating: 5 },
  { id: 30, productId: "t0015", name: "Yen", content: "Good cotton material.", rating: 4 },

  { id: 31, productId: "t0016", name: "Viet", content: "Looks great with jeans.", rating: 5 },
  { id: 32, productId: "t0016", name: "Nga", content: "Comfortable oversized style.", rating: 4 },

  { id: 33, productId: "t0017", name: "Binh", content: "The gray color is nice and neutral.", rating: 4 },
  { id: 34, productId: "t0017", name: "Linh", content: "Very comfortable for everyday use.", rating: 5 },

  { id: 35, productId: "t0018", name: "Tam", content: "The quality feels better than expected.", rating: 5 },
  { id: 36, productId: "t0018", name: "Khanh", content: "Premium looking shirt.", rating: 4 },

  { id: 37, productId: "t0019", name: "Duy", content: "Simple and comfortable.", rating: 4 },
  { id: 38, productId: "t0019", name: "Hoa", content: "Good basic shirt for everyday wear.", rating: 5 },

  { id: 39, productId: "t0020", name: "Phat", content: "The green color is beautiful.", rating: 5 },
  { id: 40, productId: "t0020", name: "Thien", content: "Comfortable and stylish.", rating: 4 },

  { id: 41, productId: "t0021", name: "Trung", content: "The fabric feels thick and durable.", rating: 5 },
  { id: 42, productId: "t0021", name: "Quang", content: "Good heavyweight shirt.", rating: 4 },

  { id: 43, productId: "t0022", name: "Thanh", content: "The cream color looks great.", rating: 5 },
  { id: 44, productId: "t0022", name: "Ngan", content: "Very easy to match with other clothes.", rating: 4 },

  { id: 45, productId: "t0023", name: "Kiet", content: "Nice shirt for casual activities.", rating: 4 },
  { id: 46, productId: "t0023", name: "Vy", content: "Comfortable and lightweight.", rating: 5 },

  { id: 47, productId: "t0024", name: "Son", content: "The loose fit is very comfortable.", rating: 5 },
  { id: 48, productId: "t0024", name: "Mai", content: "Great casual shirt.", rating: 4 },

  { id: 49, productId: "t0025", name: "Hieu", content: "Simple black design that I really like.", rating: 5 },
  { id: 50, productId: "t0025", name: "Linh", content: "Good fit and comfortable.", rating: 4 },

  { id: 51, productId: "t0026", name: "Tung", content: "The olive color looks unique.", rating: 5 },
  { id: 52, productId: "t0026", name: "Anh", content: "Nice everyday shirt.", rating: 4 },

  { id: 53, productId: "t0027", name: "Minh", content: "The material feels premium.", rating: 5 },
  { id: 54, productId: "t0027", name: "Trang", content: "Very comfortable and well made.", rating: 4 },

  { id: 55, productId: "t0028", name: "Long", content: "Nice beige color.", rating: 4 },
  { id: 56, productId: "t0028", name: "Nhi", content: "Simple and comfortable.", rating: 5 },

  { id: 57, productId: "t0029", name: "Khoa", content: "The navy color looks modern.", rating: 5 },
  { id: 58, productId: "t0029", name: "Ha", content: "Good shirt for casual outfits.", rating: 4 },

  { id: 59, productId: "t0030", name: "Nam", content: "Very comfortable white shirt.", rating: 5 },
  { id: 60, productId: "t0030", name: "My", content: "Simple design and good quality.", rating: 4 },

  { id: 61, productId: "t0031", name: "Duc", content: "The black color looks clean.", rating: 4 },
  { id: 62, productId: "t0031", name: "Phuong", content: "Fits well and feels comfortable.", rating: 5 },

  { id: 63, productId: "t0032", name: "An", content: "The red color stands out nicely.", rating: 5 },
  { id: 64, productId: "t0032", name: "Vy", content: "Good quality for the price.", rating: 4 },

  { id: 65, productId: "t0033", name: "Hung", content: "The cotton feels very comfortable.", rating: 5 },
  { id: 66, productId: "t0033", name: "Lan", content: "Premium quality and nice design.", rating: 4 },

  { id: 67, productId: "t0034", name: "Phuc", content: "Very comfortable navy shirt.", rating: 5 },
  { id: 68, productId: "t0034", name: "Chi", content: "The relaxed fit is great.", rating: 4 },

  { id: 69, productId: "t0035", name: "Dat", content: "Clean white color and nice fabric.", rating: 5 },
  { id: 70, productId: "t0035", name: "Ngoc", content: "Good everyday basic.", rating: 4 },

  { id: 71, productId: "t0036", name: "Kien", content: "Nice blue color.", rating: 4 },
  { id: 72, productId: "t0036", name: "Thuy", content: "Comfortable for daily activities.", rating: 5 },

  { id: 73, productId: "t0037", name: "Bao", content: "The fabric feels thick and durable.", rating: 5 },
  { id: 74, productId: "t0037", name: "Ngan", content: "Good heavyweight T-shirt.", rating: 4 },

  { id: 75, productId: "t0038", name: "Huy", content: "I like the minimal design.", rating: 5 },
  { id: 76, productId: "t0038", name: "Mai", content: "Simple and easy to style.", rating: 4 },

  { id: 77, productId: "t0039", name: "Son", content: "The beige color is very nice.", rating: 5 },
  { id: 78, productId: "t0039", name: "Hoa", content: "Soft and comfortable fabric.", rating: 4 },

  { id: 79, productId: "t0040", name: "Tuan", content: "Classic green color.", rating: 4 },
  { id: 80, productId: "t0040", name: "Yen", content: "Nice shirt for everyday wear.", rating: 5 },

  { id: 81, productId: "t0041", name: "Viet", content: "Looks great with streetwear outfits.", rating: 5 },
  { id: 82, productId: "t0041", name: "Trang", content: "The relaxed style is comfortable.", rating: 4 },

  { id: 83, productId: "t0042", name: "Binh", content: "Nice navy color and simple design.", rating: 5 },
  { id: 84, productId: "t0042", name: "Linh", content: "Very comfortable shirt.", rating: 4 },

  { id: 85, productId: "t0043", name: "Tam", content: "The black color looks premium.", rating: 5 },
  { id: 86, productId: "t0043", name: "Khanh", content: "Good quality and comfortable fit.", rating: 4 },

  { id: 87, productId: "t0044", name: "Duy", content: "The cream color is beautiful.", rating: 5 },
  { id: 88, productId: "t0044", name: "Thao", content: "Very easy to combine with other clothes.", rating: 4 },

  { id: 89, productId: "t0045", name: "Phat", content: "Comfortable gray T-shirt.", rating: 4 },
  { id: 90, productId: "t0045", name: "Nhi", content: "Simple design and good fabric.", rating: 5 },

  { id: 91, productId: "t0046", name: "Quang", content: "The oversized style is very comfortable.", rating: 5 },
  { id: 92, productId: "t0046", name: "My", content: "Nice modern design.", rating: 4 },

  { id: 93, productId: "t0047", name: "Trung", content: "The burgundy color looks really good.", rating: 5 },
  { id: 94, productId: "t0047", name: "Ha", content: "Nice color and comfortable fit.", rating: 4 },

  { id: 95, productId: "t0048", name: "Kiet", content: "Lightweight and comfortable.", rating: 5 },
  { id: 96, productId: "t0048", name: "Anh", content: "Good shirt for everyday use.", rating: 4 },

  { id: 97, productId: "t0049", name: "Hao", content: "The oversized fit looks great.", rating: 5 },
  { id: 98, productId: "t0049", name: "Nga", content: "Very comfortable streetwear style.", rating: 4 },

  { id: 99, productId: "t0050", name: "Minh", content: "The shirt feels premium and comfortable.", rating: 5 },
  { id: 100, productId: "t0050", name: "Linh", content: "Clean design and good quality.", rating: 4 },
];
