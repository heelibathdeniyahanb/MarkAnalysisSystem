using System.ComponentModel.DataAnnotations;

namespace MAS.Models
{
    public class Email
    {
        public int Id { get; set; }
        
        public string To { get; set; }=string.Empty;
        public string From { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTimeOffset SentDateTime { get; set; }

        public List<Attachment> Attachments { get; set; } = new List<Attachment>();
    }

    public class Attachment
    {
        [Key]
        public int Id { get; set; }

        public string FileName { get; set; }
        public byte[] Content { get; set; }

        public int EmailId { get; set; }
        public Email Email { get; set; }
    }

}

