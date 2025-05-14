import { Cloudinary } from "@cloudinary/url-gen";
import sha1 from 'crypto-js/sha1';

const cloudinaryConfig = {
  cloudName: "dgpotmqx2",
  apiKey: "546689824474885",
  apiSecret: "XoZKZgF9Uyu-GeU0s3Bayj8P8RU"
};

// Messages d'erreur personnalisés
const ERROR_MESSAGES = {
  NETWORK: "Erreur de connexion lors de l'upload de l'image",
  SERVER: "Erreur du serveur lors de l'upload de l'image",
  FORMAT: "Format d'image non supporté",
  SIZE: "Taille d'image trop grande",
  GENERIC: "Erreur lors de l'upload de l'image"
};

// Fonction pour générer la signature Cloudinary
const generateSignature = async (params) => {
  const entries = Object.entries(params);
  const sortedParams = entries.sort((a, b) => a[0].localeCompare(b[0]));
  
  let strToSign = sortedParams.map(([key, value]) => `${key}=${value}`).join('&');
  strToSign += cloudinaryConfig.apiSecret;
  
  return sha1(strToSign).toString();
};

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName
  },
  url: {
    secure: true
  }
});

export const uploadImage = async (file) => {
  try {
    // Vérification préliminaire du fichier
    if (!file || !(file instanceof File)) {
      throw new Error('Fichier invalide');
    }

    // Création du timestamp et de la signature pour l'upload signé
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "SignalHub/images";
    
    // Paramètres pour la signature
    const params = {
      timestamp: timestamp,
      folder: folder,
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    // Création de la signature
    const signature = await generateSignature(params);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("use_filename", "true");
    formData.append("unique_filename", "true");
    formData.append("overwrite", "true");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Gestion des erreurs spécifiques de Cloudinary
        switch (errorData.error?.message) {
          case 'File type not allowed':
            throw new Error(ERROR_MESSAGES.FORMAT);
          case 'File size too large':
            throw new Error(ERROR_MESSAGES.SIZE);
          default:
            throw new Error(errorData.error?.message || ERROR_MESSAGES.SERVER);
        }
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK);
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur d'upload:", error);
    throw new Error(error.message || ERROR_MESSAGES.GENERIC);
  }
};
