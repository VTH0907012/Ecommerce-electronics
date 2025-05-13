export const deleteOldImage = async (image: string | string[]) => {
    try {
      const images = Array.isArray(image) ? image : [image];

      for (const img of images) {
        const imagePath = img.replace("/uploads", "public/uploads"); 
        await fetch("/api/deleteImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imagePath }),
        });
      }
    } catch (error) {
      console.error("Lỗi xoá ảnh:", error);
    }
  };