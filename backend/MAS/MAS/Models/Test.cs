using Microsoft.Extensions.Hosting;

namespace MAS.Models
{
    public class Test
    {
        public int Id { get; set; }
        public string TestName { get; set; }=string.Empty;
        public string? TestDescription { get; set; }
        public DateOnly DateConducted { get; set; }
        public int TotalMarks { get; set; }
        public ICollection<Mark> Marks { get; } = new List<Mark>();


    }
}
