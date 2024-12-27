using System.Reflection.Metadata;
using System.Text.Json.Serialization;

namespace MAS.Models
{
    public class Mark
    {
        public int Id { get; set; }
        public float MarksObtained { get; set; }
        public string? Remarks { get; set; }
        
        public int TestId { get; set; } // Required foreign key
        [JsonIgnore]                                 
        public Test Test { get; set; } = null!;

        public int StudentId { get; set; } // Required foreign key property
        [JsonIgnore]
        public User Student { get; set; } = null!;

    }
}
