import Toast from "react-native-toast-message";

type ToastVariant = "default" | "destructive";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    const type = variant === "destructive" ? "error" : "success";
    const text1 = title || "";
    const text2 = description || "";
    
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
      visibilityTime: 3000,
    });
  };

  return {
    toast,
  };
}

export { useToast };