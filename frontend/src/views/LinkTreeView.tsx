import { useEffect, useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";
import { SocialNetwork, User } from "../types";

export default function LinkTreeView() {
  const [socialLinks, setSocialLinks] = useState(social);

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(['user'])!
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Actualizado correctamente')
    }
  })

  useEffect(() => {
    const updatedData = socialLinks.map(item => {
      const userLink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name);
      if (userLink) { 
        return  {...item, url: userLink.url, enabled: userLink.enabled}
      } 
      return item;
    })
    setSocialLinks(updatedData);
    
  }, []) 

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = socialLinks.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link);
    setSocialLinks(updatedLinks);
    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedLinks)
      }
    });
  }

  const handleEnableLink = (socialLink: string) => {
    const updatedLinks = socialLinks.map(link => {
      if (link.name === socialLink) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else {
          toast.error('URL no valida')
        }
      }
      return link
    });
    setSocialLinks(updatedLinks)
    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedLinks)
      }
    });
  }

  return (
    <>
      <div className="">
        {socialLinks.map(item => (
          <DevTreeInput
            item={item}
            key={item.name}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
        <button
          className="bg-cyan-400 p-2  text-lg w-full uppercase text-slate-600 rounded font-bold"
          onClick={() => mutate(user)}
        >Guardar Cambios</button>
      </div>
    </>
  )
}